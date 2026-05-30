import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { Badge } from "primereact/badge";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "./ImageUpload.css";

const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY || "";

/* ─── Resize image without stretching (preserves aspect ratio) ─── */
function resizeImagePreserveAspect(src, maxSize = 1200) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const longest = Math.max(img.naturalWidth, img.naturalHeight);
            const scale = longest > maxSize ? maxSize / longest : 1;
            const width = Math.max(1, Math.round(img.naturalWidth * scale));
            const height = Math.max(1, Math.round(img.naturalHeight * scale));

            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);
            resolve({
                dataUrl: canvas.toDataURL("image/jpeg", 0.92),
                width,
                height,
            });
        };
        img.onerror = reject;
        img.src = src;
    });
}

function MultiImage({ handleImages }) {
    const toast          = useRef(null);
    const uploadRef      = useRef(null);
    const [files,        setFiles]        = useState([]);
    const [loading,      setLoading]      = useState(false);

    /* library state */
    const [showLib,      setShowLib]      = useState(false);
    const [query,        setQuery]        = useState("fashion clothing");
    const [results,      setResults]      = useState([]);
    const [libLoading,   setLibLoading]   = useState(false);
    const [page,         setPage]         = useState(1);
    const [totalPages,   setTotalPages]   = useState(1);

    /* ── propagate to parent ── */
    useEffect(() => {
        handleImages(files.map((f) => f.fileBase64));
    }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

    /* ── local upload → auto-resize ── */
    const onFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setLoading(true);
        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const { dataUrl, width, height } = await resizeImagePreserveAspect(reader.result);
                const ext = `.${file.type.split("/")[1]}`;
                setFiles((prev) => {
                    if (prev.some((f) => f.fileBase64 === dataUrl)) return prev;
                    return [...prev, { fileBase64: dataUrl, fileName: file.name, fileSize: file.size, fileExtension: ext, width, height }];
                });
                toast.current.show({ severity: "success", summary: "Image added", detail: `Optimized to ${width}×${height} (aspect ratio kept).` });
                setLoading(false);
            };
            reader.readAsDataURL(file);
        } catch {
            toast.current.show({ severity: "error", summary: "Error", detail: "Could not process image." });
            setLoading(false);
        }
        e.target.value = "";
    };

    const handleRemove = (b64) => setFiles((prev) => prev.filter((f) => f.fileBase64 !== b64));
    const handleClear  = () => setFiles([]);

    /* ── Unsplash search ── */
    const searchUnsplash = useCallback(async (pg = 1) => {
        if (!UNSPLASH_KEY) {
            toast.current.show({
                severity: "warn",
                summary: "API key missing",
                detail: "Add your free Unsplash key to .env as REACT_APP_UNSPLASH_KEY",
                life: 6000,
            });
            return;
        }
        setLibLoading(true);
        try {
            const res  = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=16&page=${pg}&orientation=squarish`,
                { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
            );
            const data = await res.json();
            setResults(data.results || []);
            setTotalPages(data.total_pages || 1);
            setPage(pg);
        } catch {
            toast.current.show({ severity: "error", summary: "Search failed", detail: "Check internet connection or API key." });
        }
        setLibLoading(false);
    }, [query]);

    /* load initial results when dialog opens */
    const openLibrary = () => {
        setShowLib(true);
        if (results.length === 0) searchUnsplash(1);
    };

    /* pick an Unsplash image → resize → add */
    const pickImage = async (photo) => {
        setLibLoading(true);
        try {
            const url = `${photo.urls.raw}&w=1200&auto=format`;
            const { dataUrl, width, height } = await resizeImagePreserveAspect(url);
            setFiles((prev) => {
                if (prev.some((f) => f.fileBase64 === dataUrl)) return prev;
                return [...prev, {
                    fileBase64     : dataUrl,
                    fileName       : `${photo.slug ?? "unsplash"}.jpg`,
                    fileSize       : 0,
                    fileExtension  : ".jpg",
                    photographer   : photo.user?.name,
                    width,
                    height,
                }];
            });
            toast.current.show({ severity: "success", summary: "Image added", detail: `Optimized to ${width}×${height}.` });
            setShowLib(false);
        } catch {
            toast.current.show({ severity: "error", summary: "Error", detail: "Could not load image. Try another." });
        }
        setLibLoading(false);
    };

    /* ── header buttons ── */
    const header = () => (
        <div className="multi-image-header">
            <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                style={{ display: "none" }}
                ref={uploadRef}
                onChange={onFileChange}
            />
            <Button
                icon="pi pi-upload"
                label="Upload Image"
                onClick={(e) => { e.preventDefault(); uploadRef.current.click(); }}
                className="p-button-sm"
            />
            <Button
                icon="pi pi-images"
                label="Browse Free Images"
                onClick={(e) => { e.preventDefault(); openLibrary(); }}
                className="p-button-sm p-button-outlined ml-2"
            />
            {files.length > 0 && (
                <Button
                    icon="pi pi-trash"
                    label="Clear All"
                    onClick={(e) => { e.preventDefault(); handleClear(); }}
                    className="p-button-sm p-button-danger p-button-outlined ml-2"
                />
            )}
            <span className="multi-image-hint">
                <i className="pi pi-info-circle mr-1" />
                Any size accepted — aspect ratio preserved, max 1200px
            </span>
        </div>
    );

    /* ── Unsplash library dialog ── */
    const libraryDialog = () => (
        <Dialog
            header={
                <div className="lib-dialog-header">
                    <i className="pi pi-images mr-2" style={{ color: "#4f6ef7" }} />
                    Free Image Library
                    <span className="lib-credit">Powered by Unsplash</span>
                </div>
            }
            visible={showLib}
            style={{ width: "860px", maxWidth: "95vw" }}
            onHide={() => setShowLib(false)}
            modal
            contentClassName="lib-dialog-body"
        >
            {!UNSPLASH_KEY ? (
                <div className="lib-no-key">
                    <i className="pi pi-key lib-key-icon" />
                    <h3>Free Unsplash API key required</h3>
                    <ol>
                        <li>Go to <a href="https://unsplash.com/developers" target="_blank" rel="noreferrer">unsplash.com/developers</a></li>
                        <li>Create a free account &amp; click <strong>"New Application"</strong></li>
                        <li>Copy your <strong>Access Key</strong></li>
                        <li>Open <code>.env</code> in the project root and set:<br />
                            <code>REACT_APP_UNSPLASH_KEY=your_key_here</code>
                        </li>
                        <li>Restart the dev server — done!</li>
                    </ol>
                    <p className="lib-note">Free tier: 50 requests / hour · No credit card needed.</p>
                </div>
            ) : (
                <>
                    <div className="lib-search-bar">
                        <span className="p-input-icon-left lib-search-input">
                            <i className="pi pi-search" />
                            <InputText
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && searchUnsplash(1)}
                                placeholder="Search images (e.g. shoes, jacket, watch…)"
                            />
                        </span>
                        <Button
                            label="Search"
                            icon="pi pi-search"
                            onClick={() => searchUnsplash(1)}
                            disabled={libLoading}
                            className="ml-2"
                        />
                    </div>

                    {libLoading ? (
                        <div className="lib-spinner">
                            <div className="lib-spinner-ring" />
                            <p>Loading images…</p>
                        </div>
                    ) : (
                        <>
                            <div className="lib-grid">
                                {results.map((photo) => (
                                    <div
                                        key={photo.id}
                                        className="lib-thumb"
                                        onClick={() => pickImage(photo)}
                                        title={`Photo by ${photo.user?.name}`}
                                    >
                                        <img
                                            src={photo.urls.small}
                                            alt={photo.alt_description || photo.slug}
                                            loading="lazy"
                                        />
                                        <div className="lib-thumb-overlay">
                                            <i className="pi pi-plus-circle" />
                                            <span>{photo.user?.name}</span>
                                        </div>
                                    </div>
                                ))}
                                {results.length === 0 && (
                                    <p className="lib-empty">No results — try a different keyword.</p>
                                )}
                            </div>

                            {totalPages > 1 && (
                                <div className="lib-pagination">
                                    <Button
                                        icon="pi pi-chevron-left"
                                        disabled={page <= 1}
                                        onClick={() => searchUnsplash(page - 1)}
                                        className="p-button-text"
                                    />
                                    <span>Page {page} / {totalPages}</span>
                                    <Button
                                        icon="pi pi-chevron-right"
                                        disabled={page >= totalPages}
                                        onClick={() => searchUnsplash(page + 1)}
                                        className="p-button-text"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </Dialog>
    );

    return (
        <>
            <Toast ref={toast} position="bottom-center" />
            {libraryDialog()}

            <Panel header={header}>
                <div className="formgrid grid">
                    {files.length > 0 ? (
                        files.map((file, i) => (
                            <React.Fragment key={i}>
                                <div className="field col-12 md:col-3">
                                    <div className="multi-img-preview">
                                        <img src={file.fileBase64} alt={file.fileName} />
                                        {file.photographer && (
                                            <span className="multi-img-credit">
                                                <i className="pi pi-user mr-1" style={{ fontSize: "0.7rem" }} />
                                                {file.photographer}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-5 mt-2">
                                    <p className="multi-img-name">{file.fileName}</p>
                                    <span className="multi-img-dim">
                                        {file.width && file.height ? `${file.width} × ${file.height} px` : "Optimized"}
                                    </span>
                                </div>
                                <div className="field col-12 md:col-3 mt-2">
                                    {file.fileSize > 0 && (
                                        <Badge value={`${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`} />
                                    )}
                                </div>
                                <div className="field col-12 md:col-1">
                                    <Button
                                        className="p-button-danger p-button-outlined p-button-sm"
                                        onClick={(e) => { e.preventDefault(); handleRemove(file.fileBase64); }}
                                        icon="pi pi-trash"
                                    />
                                </div>
                            </React.Fragment>
                        ))
                    ) : (
                        <div className="multi-img-empty">
                            <i className="pi pi-image" />
                            <span>No images yet. Upload or browse free images above.</span>
                        </div>
                    )}
                    {loading && (
                        <div className="multi-img-loading">
                            <div className="lib-spinner-ring" />
                            <span>Processing…</span>
                        </div>
                    )}
                </div>
            </Panel>
        </>
    );
}

export default MultiImage;
