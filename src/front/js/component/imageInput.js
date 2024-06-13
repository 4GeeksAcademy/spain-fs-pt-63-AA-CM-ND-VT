import React, { useEffect, useRef, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from '@cloudinary/react';
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useContext } from "react";
import { Context } from "../store/appContext";

const ImageInput = ({ onUpload }) => {
    const cloudinaryRef = useRef()
    const widgetRef = useRef()
    const [imgId, setImgId] = useState("")
    const { actions } = useContext(Context)

    useEffect(() => {
        cloudinaryRef.current = window.cloudinary
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: "dszc6zmjd",
            uploadPreset: "dkjhfr4t"
        }, function (error, result) {
            if (!error && result && result.event === "success") {
                setImgId(result.info.public_id);
                onUpload(result.info.public_id);
            }
        })
    }, [onUpload])

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    })

    const myImage = imgId ? cld.image(imgId) : null
    myImage && myImage.resize(fill().width(250).height(250))

    return (
        <div>
            <button type="button" className="btn btn-primary" onClick={() => widgetRef.current.open()}>
                Upload Image
            </button>
            {myImage && <AdvancedImage cldImg={myImage} />} 
        </div>
    )
}

export default ImageInput;
