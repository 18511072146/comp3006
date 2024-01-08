import { Box, TextField, Grid, Button } from "@mui/material"
import React from "react"
import { Room } from "../models/Room";
import axios from "axios";
import { MutatorCallback } from "swr";

interface Props {
    room?: Room,
    mutate: MutatorCallback<Room[]>,
    handleFinish: () => void,
}

export const EditRoom: React.FC<Props> = (props) => {

    const { room, mutate, handleFinish } = props

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const formData: { [key: string]: string } = {};
        for (const [key, value] of data.entries()) {
            formData[key] = value.toString();
        }

        if (room) {
            const response = await axios.put(`/api/room?id=${room._id}`, {
                ...formData,
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password'),
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response);
        } else {
            const response = await axios.post(`/api/room?id=${localStorage.getItem('hotelId')}`, {
                ...formData,
                email: localStorage.getItem('email'),
                password: localStorage.getItem('password'),
                available: true,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response);
        }

        await mutate();
        handleFinish();
    };

    return (
        <>

            <Box
                className="flex flex-col flex-items-center"
            >
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="roomId"
                        label="Room ID"
                        name="roomId"
                        autoComplete="roomId"
                        autoFocus
                        defaultValue={props.room?.roomId}
                        type="number"
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="roomType"
                        label="Room Type"
                        name="roomType"
                        autoComplete="roomType"
                        autoFocus
                        defaultValue={props.room?.roomType}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        autoComplete="price"
                        autoFocus
                        defaultValue={props.room?.price}
                    />

                    <Grid item xs>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            {props.room ? "Save" : "Add"}
                        </Button>
                    </Grid>
                </Box>
            </Box>

        </>
    )

}