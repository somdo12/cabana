import { useState, useEffect, useRef, useCallback } from "react";
import Axios from "axios";

function Todolist() {
    const [ListData, setListData] = useState([]);
    const ReflistId = useRef([]);
    const [textData, setTextData] = useState("");
    const [updateData, setEditData] = useState("");

    const fatchListData = useCallback(async () => {
        try {
            console.log("fatchListData");
            const uri = "http://localhost:5000/v1/store/fetch";

            const bodyData = {
                db_type: "mysql",
                store_code: "Todolist",
                field_list: "*",
                where: "*"
            }
            const headers = { "Content-Type": "application/json" };

            const result = await Axios.post(uri, bodyData, headers);
            console.log("result", result);

            setListData(result.data.data);

            return result.data;

        } catch (error) {
            console.log("fatchListData Error", error);
        }
    }, []);
    useEffect(() => {
        fatchListData();
    }, [fatchListData]);

    const createData = async () => {
        try {
            console.log("createData");
            const uri = "http://localhost:5000/v1/store/create";

            const bodyData = {
                db_type: "mysql",
                store_code: "Todolist",
                where: "*",
                set: [
                    {
                        text: textData,
                        is_finished: 0
                    }
                ]
            }
            const headers = { "Content-Type": "application/json" };

            const result = await Axios.post(uri, bodyData, headers);
            console.log("result", result);
            setListData(prevList => [...prevList, ...result.data.data]);

            // setListData(result.data.data);
            console.log("ListData", ListData);

            fatchListData();

            return result.data;

        } catch (error) {
            console.log("createData Error", error);
        }
    }

    const deleteData = async (id) => {
        try {
            console.log(id);
            console.log("deleteData");

            const uri = "http://localhost:5000/v1/store/delete";

            const bodyData = {
                "db_type": "mysql",
                "store_code": "Todolist",
                "where": {
                    "id": id
                }
            }

            console.log(bodyData);

            const configs = {
                headers: {
                    "Content-Type": "application/json"
                }
            };

            const result = await Axios.post(uri, bodyData, configs);

            console.log("result", result);
            fatchListData();

        } catch (error) {
            console.log("deleteData Error", error);
        }
    }

    const editData = async (id) => {
        try {
            console.log(id);
            console.log("editData");

            const uri = "http://localhost:5000/v1/store/edit";

            const bodyData = {
                "db_type": "mysql",
                "store_code": "Todolist",
                "where": {
                    "id": id
                },
                "set": {
                    "is_finished": 1
                }
            }

            console.log(bodyData);

            const configs = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const result = await Axios.post(uri, bodyData, configs);
            console.log("result", result);
            fatchListData();

        } catch (error) {
            console.log("updateData Error", error);
        }
    }

    const editTextData = async (id) => {
        try {
            console.log(id);
            console.log("editData");

            const uri = "http://localhost:5000/v1/store/edit";

            const bodyData = {
                "db_type": "mysql",
                "store_code": "Todolist",
                "where":{
                    "id": ReflistId.current
                },
                "set": {
                    "is_finished": 0,
                    "text": textData
                }
            }

            console.log(bodyData);

            const configs = {
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const result = await Axios.post(uri, bodyData, configs);
            console.log("result", result);
            fatchListData();

        } catch (error) {
            console.log("updateData Error", error);
        }
    }

    const addIds = (id) => {
        ReflistId.current.push(id);
        console.log("ReflistId", ReflistId.current);
    }
    
    return (
        <div>
            <h1>Todolist</h1>
            <ul>
                {ListData.map((item, index) => (
                    <li key={index}>
                        {item.id} /
                        {item.text} /
                        {item.is_finished}
                        <button onClick={() => deleteData(item.id)}>delete </button>
                        <button onClick={() => editData(item.id)}>edit</button>
                        <input type="checkbox" onChange={(event) => addIds(item.id)} />
                    </li>
                ))}
            </ul>

            {/* <button onClick={fatchListData}>clik me</button> */}
            <input type="text" onChange={(event) => setTextData(event.target.value)} value={textData} />
            <button onClick={createData}>Create</button>
            <br />
            <input type="text" onChange={(event) => setTextData(event.target.value)} value={textData} />
            <button onClick={editTextData}>edit</button>

        </div>
    );
}

export default Todolist;