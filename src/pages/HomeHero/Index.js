import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Chips } from "primereact/chips";
import { InputNumber } from "primereact/inputnumber";
import { toast } from "react-toastify";
import axios from "axios";

import { handleGetRequest } from "../../service/GetTemplate";
import { handlePostRequest } from "../../service/PostTemplate";
import { handlePatchRequest } from "../../service/PatchTemplete";
import { handleDeleteRequest } from "../../service/DeleteTemplete";
import { baseURL } from "../../utilities/Config";

const GENDER_OPTIONS = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Juniors", value: "juniors" },
    { label: "Unisex", value: "unisex" },
];

const toAbsMediaUrl = (pathOrDataUrl) => {
    if (!pathOrDataUrl) return "";
    if (typeof pathOrDataUrl !== "string") return "";
    if (pathOrDataUrl.startsWith("data:")) return pathOrDataUrl;
    if (pathOrDataUrl.startsWith("http://") || pathOrDataUrl.startsWith("https://")) return pathOrDataUrl;
    return `${baseURL}${pathOrDataUrl.startsWith("/") ? pathOrDataUrl : `/${pathOrDataUrl}`}`;
};

const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

const HomeHeroForm = ({ visible, onHide, onSaved, editable, rowData }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);

    const initialValues = useMemo(
        () => ({
            gender: rowData?.gender || "unisex",
            video: rowData?.video || "",
            poster: rowData?.poster || "",
            labels: rowData?.labels || [],
            headline: rowData?.headline || "",
            subheadline: rowData?.subheadline || "",
            announcementEnabled:
                rowData?.announcement && typeof rowData.announcement.enabled === "boolean"
                    ? rowData.announcement.enabled
                    : false,
            announcementMessages: Array.isArray(rowData?.announcement?.messages)
                ? rowData.announcement.messages
                : [],
            ctaText: rowData?.cta?.text || "",
            ctaHref: rowData?.cta?.href || "",
            overlayColor: rowData?.theme?.overlayColor || "#000000",
            overlayOpacity:
                typeof rowData?.theme?.overlayOpacity === "number" ? rowData.theme.overlayOpacity : 0.35,
            textColor: rowData?.theme?.textColor || "#ffffff",
            sortOrder: typeof rowData?.sortOrder === "number" ? rowData.sortOrder : 0,
            isActive: typeof rowData?.isActive === "boolean" ? rowData.isActive : true,
        }),
        [rowData]
    );

    const formik = useFormik({
        enableReinitialize: true,
        initialValues,
        validationSchema: Yup.object().shape({
            gender: Yup.string().oneOf(GENDER_OPTIONS.map((x) => x.value)).required("Gender is required"),
            headline: Yup.string().max(200, "Max 200 characters"),
            subheadline: Yup.string().max(400, "Max 400 characters"),
            overlayOpacity: Yup.number().min(0).max(1),
            sortOrder: Yup.number().min(0),
        }),
        onSubmit: async (values) => {
            const payload = {
                gender: values.gender,
                video: values.video,
                poster: values.poster,
                labels: values.labels || [],
                headline: values.headline,
                subheadline: values.subheadline,
                announcement: values.announcementEnabled
                    ? {
                        enabled: true,
                        messages: values.announcementMessages || [],
                    }
                    : {
                        enabled: false,
                        messages: values.announcementMessages || [],
                    },
                cta: { text: values.ctaText || "", href: values.ctaHref || "" },
                theme: {
                    overlayColor: values.overlayColor || "#000000",
                    overlayOpacity: typeof values.overlayOpacity === "number" ? values.overlayOpacity : 0.35,
                    textColor: values.textColor || "#ffffff",
                },
                sortOrder: Number(values.sortOrder) || 0,
                isActive: Boolean(values.isActive),
            };

            setSaving(true);
            let res;
            if (editable) {
                res = await dispatch(
                    handlePatchRequest(
                        { heroId: rowData?._id, ...payload },
                        "api/v1/homeHero/",
                        true,
                        true
                    )
                );
            } else {
                res = await dispatch(handlePostRequest(payload, "api/v1/homeHero/", true, true));
            }
            setSaving(false);

            if (res?.status === 200) {
                onSaved && onSaved();
                onHide();
            }
        },
    });

    const onFilePick = async (field, file) => {
        if (!file) return;
        try {
            const dataUrl = await readFileAsDataUrl(file);
            formik.setFieldValue(field, dataUrl);
        } catch (e) {
            toast.warn("Failed to read file");
        }
    };

    const error = (name) => (formik.touched[name] && formik.errors[name] ? <small className="p-error">{formik.errors[name]}</small> : null);

    return (
        <Dialog
            header={editable ? "Edit Home Hero" : "Add Home Hero"}
            visible={visible}
            style={{ width: "70vw", maxWidth: 1100 }}
            onHide={onHide}
        >
            <form onSubmit={formik.handleSubmit}>
                <div className="grid">
                    <div className="col-12 md:col-4">
                        <div className="flex flex-column">
                            <label className="mb-2">Gender</label>
                            <Dropdown
                                id="gender"
                                name="gender"
                                value={formik.values.gender}
                                options={GENDER_OPTIONS}
                                optionLabel="label"
                                optionValue="value"
                                onChange={formik.handleChange}
                                className="w-full inputClass"
                            />
                            {error("gender")}
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="flex flex-column">
                            <label className="mb-2">Sort Order</label>
                            <InputNumber
                                inputId="sortOrder"
                                value={formik.values.sortOrder}
                                onValueChange={(e) => formik.setFieldValue("sortOrder", e.value ?? 0)}
                                min={0}
                                className="w-full inputClass"
                            />
                            {error("sortOrder")}
                        </div>
                    </div>

                    <div className="col-12 md:col-4 flex align-items-center">
                        <div className="flex flex-column">
                            <label className="mb-2">Is Active?</label>
                            <Checkbox
                                id="isActive"
                                name="isActive"
                                checked={formik.values.isActive}
                                onChange={(e) => formik.setFieldValue("isActive", e.checked)}
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Headline</label>
                            <InputText
                                id="headline"
                                name="headline"
                                value={formik.values.headline}
                                onChange={formik.handleChange}
                                className="w-full inputClass"
                            />
                            {error("headline")}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Subheadline</label>
                            <InputText
                                id="subheadline"
                                name="subheadline"
                                value={formik.values.subheadline}
                                onChange={formik.handleChange}
                                className="w-full inputClass"
                            />
                            {error("subheadline")}
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Labels (comma or Enter)</label>
                            <Chips
                                id="labels"
                                name="labels"
                                value={formik.values.labels}
                                onChange={(e) => formik.setFieldValue("labels", e.value)}
                                separator=","
                                className="w-full inputClass"
                            />
                        </div>
                    </div>

                    <div className="col-12">
                        <div className="flex flex-column">
                            <label className="mb-2">Announcement</label>
                            <div className="flex align-items-center gap-2 mb-3">
                                <Checkbox
                                    inputId="announcementEnabled"
                                    checked={formik.values.announcementEnabled}
                                    onChange={(e) => formik.setFieldValue("announcementEnabled", e.checked)}
                                />
                                <label htmlFor="announcementEnabled" className="m-0">
                                    Enable announcement banner/messages
                                </label>
                            </div>

                            <Chips
                                id="announcementMessages"
                                name="announcementMessages"
                                value={formik.values.announcementMessages}
                                onChange={(e) => formik.setFieldValue("announcementMessages", e.value)}
                                separator=","
                                className="w-full inputClass"
                                placeholder="Add message and press Enter (or comma)"
                            />
                            <small className="text-600 mt-2">
                                These messages will be sent as <code>announcement.messages</code>.
                            </small>
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">CTA Text</label>
                            <InputText
                                id="ctaText"
                                name="ctaText"
                                value={formik.values.ctaText}
                                onChange={formik.handleChange}
                                className="w-full inputClass"
                            />
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">CTA Link (href)</label>
                            <InputText
                                id="ctaHref"
                                name="ctaHref"
                                value={formik.values.ctaHref}
                                onChange={formik.handleChange}
                                className="w-full inputClass"
                                placeholder="e.g. /sale or https://..."
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-4">
                        <div className="flex flex-column">
                            <label className="mb-2">Overlay Color</label>
                            <input
                                type="color"
                                value={formik.values.overlayColor || "#000000"}
                                onChange={(e) => formik.setFieldValue("overlayColor", e.target.value)}
                                style={{ height: 40, padding: 0, border: "1px solid #ddd", borderRadius: 6 }}
                            />
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="flex flex-column">
                            <label className="mb-2">Overlay Opacity (0 - 1)</label>
                            <InputNumber
                                inputId="overlayOpacity"
                                value={formik.values.overlayOpacity}
                                onValueChange={(e) => formik.setFieldValue("overlayOpacity", e.value ?? 0)}
                                min={0}
                                max={1}
                                step={0.05}
                                mode="decimal"
                                minFractionDigits={0}
                                maxFractionDigits={2}
                                className="w-full inputClass"
                            />
                            {error("overlayOpacity")}
                        </div>
                    </div>
                    <div className="col-12 md:col-4">
                        <div className="flex flex-column">
                            <label className="mb-2">Text Color</label>
                            <input
                                type="color"
                                value={formik.values.textColor || "#ffffff"}
                                onChange={(e) => formik.setFieldValue("textColor", e.target.value)}
                                style={{ height: 40, padding: 0, border: "1px solid #ddd", borderRadius: 6 }}
                            />
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Video</label>
                            <input
                                type="file"
                                accept="video/*"
                                onChange={(e) => onFilePick("video", e.target.files?.[0])}
                            />
                            {formik.values.video ? (
                                <video
                                    controls
                                    style={{ width: "100%", marginTop: 10, borderRadius: 8, background: "#000" }}
                                    src={toAbsMediaUrl(formik.values.video)}
                                />
                            ) : (
                                <small className="text-600">Upload a video file (optional).</small>
                            )}
                        </div>
                    </div>

                    <div className="col-12 md:col-6">
                        <div className="flex flex-column">
                            <label className="mb-2">Poster</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => onFilePick("poster", e.target.files?.[0])}
                            />
                            {formik.values.poster ? (
                                <img
                                    alt="poster"
                                    src={toAbsMediaUrl(formik.values.poster)}
                                    style={{ width: "100%", marginTop: 10, borderRadius: 8, objectFit: "cover", maxHeight: 240 }}
                                />
                            ) : (
                                <small className="text-600">Upload an image file (optional).</small>
                            )}
                        </div>
                    </div>

                    <div className="col-12 md:col-12 text-center mt-2">
                        <Button
                            type="button"
                            label="Cancel"
                            className="Cancelbtn p-mr-3"
                            onClick={onHide}
                            disabled={saving}
                        />
                        <Button type="submit" label={editable ? "Update" : "Save"} className="Savebtn p-mr-3" loading={saving} />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

const Index = () => {
    const dispatch = useDispatch();
    const [globalFilter, setGlobalFilter] = useState("");
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [editable, setEditable] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const getData = async () => {
        setLoading(true);
        let res;
        try {
            const response = await axios.get(`${baseURL}api/v1/homeHero/all`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token") || "",
                },
            });
            res = response?.data?.data;
        } catch (e) {
            res = await handleGetRequest("api/v1/homeHero/all", false);
        }
        setLoading(false);
        setRows(Array.isArray(res) ? res : []);
    };

    useEffect(() => {
        getData();
    }, []);

    const onAdd = () => {
        setEditable(false);
        setSelectedRow(null);
        setVisible(true);
    };

    const onEdit = (rowData) => {
        setEditable(true);
        setSelectedRow(rowData);
        setVisible(true);
    };

    const onDelete = async (rowData) => {
        const id = rowData?._id;
        if (!id) return;

        // eslint-disable-next-line no-restricted-globals
        const ok = confirm("Delete this Home Hero item?");
        if (!ok) return;

        const res = await dispatch(handleDeleteRequest({}, `api/v1/homeHero/?heroId=${id}`, true, true));
        if (res?.status === 200) {
            getData();
        }
    };

    const actionTemplate = (rowData) => (
        <div className="Edit_Icon">
            <Button
                tooltip="Edit"
                icon="pi pi-pencil"
                tooltipOptions={{ position: "top" }}
                className="edit p-mr-2"
                onClick={() => onEdit(rowData)}
            />
            <Button
                tooltip="Delete"
                icon="pi pi-trash"
                tooltipOptions={{ position: "top" }}
                className="delete p-button-danger p-mr-2"
                onClick={() => onDelete(rowData)}
            />
        </div>
    );

    const isActiveTemplate = (rowData) => (
        <span className={rowData?.isActive ? "text-green-600" : "text-red-600"}>
            {rowData?.isActive ? "Active" : "Inactive"}
        </span>
    );

    const genderTemplate = (rowData) => {
        const g = rowData?.gender || "unisex";
        return <span style={{ textTransform: "capitalize" }}>{g}</span>;
    };

    const mediaTemplate = (rowData) => {
        const posterSrc = toAbsMediaUrl(rowData?.poster);
        const videoSrc = toAbsMediaUrl(rowData?.video);
        return (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {posterSrc ? (
                    <img alt="poster" src={posterSrc} style={{ width: 64, height: 40, objectFit: "cover", borderRadius: 6 }} />
                ) : (
                    <div style={{ width: 64, height: 40, borderRadius: 6, background: "#eee" }} />
                )}
                {videoSrc ? (
                    <a href={videoSrc} target="_blank" rel="noreferrer">
                        Video
                    </a>
                ) : (
                    <span className="text-500">No video</span>
                )}
            </div>
        );
    };

    return (
        <div>
            <HomeHeroForm
                visible={visible}
                editable={editable}
                rowData={selectedRow}
                onHide={() => setVisible(false)}
                onSaved={getData}
            />

            <div className="grid">
                <div className="col-12">
                    <div className="text-right flex float_right">
                        <div className="">
                            <span className="p-input-icon-right mr-3">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="p-inputtext p-component p-filled"
                                    onInput={(e) => setGlobalFilter(e.target.value)}
                                />
                                <i className="pi pi-search"></i>
                            </span>
                        </div>
                        <Button label="Add Home Hero" icon="pi pi-plus" className="Savebtn" onClick={onAdd} />
                    </div>
                </div>

                <div className="col-12">
                    <div className="innr-Body">
                        <DataTable
                            value={rows}
                            loading={loading}
                            paginator
                            rows={10}
                            responsiveLayout="scroll"
                            globalFilter={globalFilter}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} Records"
                        >
                            <Column body={genderTemplate} header="Gender" style={{ width: "9rem" }} />
                            <Column field="headline" header="Headline" />
                            <Column field="subheadline" header="Subheadline" />
                            <Column body={mediaTemplate} header="Media" style={{ width: "14rem" }} />
                            <Column field="sortOrder" header="Sort" style={{ width: "6rem" }} />
                            <Column body={isActiveTemplate} header="Status" style={{ width: "7rem" }} />
                            <Column body={actionTemplate} header="Action" style={{ width: "10rem" }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;

