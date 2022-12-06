import React from "react";
import { Dialog } from "primereact/dialog";
import loaderGif from "../assets/loaderZstore.gif";
import "./loader.scss";

function GlobalLoader({ isShow }) {
    return (
        <div>
            <Dialog header={"Loading"} showHeader={false} draggable={false} visible={isShow} style={{ width: "40vw", height: "70vh", textAlign: "center", borderRadius: "50px" }} className="dialog-style">
                <img src={loaderGif} alt="" height="80%" width="100%" style={{ textAlign: "center", marginTop: "10%" }} />
            </Dialog>
        </div>
    );
}

export default GlobalLoader;
