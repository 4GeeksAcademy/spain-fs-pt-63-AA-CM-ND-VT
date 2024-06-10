import React, { useEffect, useRef, useState } from "react";
import { Cloudinary } from "@cloudinary/url-gen/index";
import { AdvancedImage } from '@cloudinary/react';
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useContext } from "react";
import { Context } from "../store/appContext";

const ImageInput = () => {
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
                handleUploadImage(result.info.public_id)
            }
        })
    }, [])

    const cld = new Cloudinary({
        cloud: {
            cloudName: 'dszc6zmjd'
        }
    })

    const myImage = imgId ? cld.image(imgId) : null
    myImage && myImage.resize(fill().width(250).height(250))

    const handleUploadImage = async (publicId) => {
        try {
            const image = await actions.uploadWorkImage(publicId);
            console.log("Image uploaded:", image);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    }

    return (
        <div>
            <button onClick={() => widgetRef.current.open()}>Open</button>
            {/* {myImage && <AdvancedImage cldImg={myImage} />} */}
        </div>
    )
}

export default ImageInput