import React, { useContext } from "react";
import { Context } from "../../store/appContext";

const AdminServices = () => {
    const { store, actions } = useContext(Context);

    const handleCreate = async () => {
        await actions.createService();
    };

    return (
        <div className="flex">
            <button className="btn-success rounded py-1 px-2" onClick={handleCreate}>Create</button>
        </div>
    );
};

export default AdminServices;
