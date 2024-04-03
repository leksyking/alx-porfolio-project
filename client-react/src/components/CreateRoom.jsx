// import React from "react";
// import { useNavigate } from "react-router-dom";

// const CreateRoom = (props) => {
//         const navigate = useNavigate();
//         const create = async (e) => {
//                 e.preventDefault();

//                 const resp = await fetch(
//                         "http://localhost:8080/api/v1/room/create"
//                 );
//                 const { room_id } = await resp.json();

//                 navigate(`/room/${room_id}`);
//         };
//         return (
//                 <div>
//                         <button onClick={create}>Create Room</button>
//                 </div>
//         );
// };
// export default CreateRoom;


import React from "react";

const CreateRoom = (props) => {
    const create = async (e) => {
        e.preventDefault();
        const resp = await fetch(
                "http://localhost:8080/api/v1/room/create"
        );
        const { room_id } = await resp.json();

		props.history.push(`/room/${room_id}`)
    };

    return (
        <div>
            <button onClick={create}>Create Room</button>
        </div>
    );
};

export default CreateRoom;

