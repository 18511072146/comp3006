import { Link, useParams } from "react-router-dom";
import { Hotel } from "../models/Hotel";
import { fetcher } from "../api";
import useSWR from "swr";
import axios, { AxiosError } from "axios";
import { Room } from "../models/Room";
import { Alert, AlertTitle, Button, Card, CardContent, FormControl, FormLabel, Icon, Input, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs';
import HomeIcon from '@mui/icons-material/Home';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { MutatorCallback } from "swr/_internal";
import PrimarySearchAppBar from "../components/header";
import Chat from "../components/chat";

function HotelPage() {
    const { hotelId } = useParams();
    const [searchText, setSearchText] = useState('');

    const { data: hotelData, error: hotelError }: { data?: Hotel, error?: AxiosError } = useSWR<Hotel>(`/hotel?id=${hotelId}`, fetcher);
    const { data: roomData, error: roomError, mutate: roomMutate }: { data?: Room[], error?: AxiosError, mutate: MutatorCallback<Room[]> } = useSWR<Room[]>(`/room?id=${hotelId}`, fetcher);

    return (
        <>
            <PrimarySearchAppBar searchTextHook={[searchText, setSearchText]} />
            {
                hotelError && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Failed to load hotel information.
                    </Alert>
                )
            }

            {
                roomError && (
                    <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        Failed to load room information.
                    </Alert>
                )
            }

            <div className="flex flex-row gap-4 pt-16">

                {
                    hotelData && (
                        <div className="w-100 flex-col">
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        <Icon color="primary">
                                            <HomeIcon />
                                        </Icon>
                                        {hotelData.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <Icon color="secondary">
                                            <LocalPhoneIcon />
                                        </Icon>
                                        {hotelData.phone}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary">
                                        <Icon color="error">
                                            <LocationOnIcon />
                                        </Icon>
                                        {hotelData.location}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <div className="p-2"></div>

                            <Card>
                                <Chat />
                            </Card>
                        </div>
                    )
                }

                <div className="flex flex-col flex-auto gap-4" >

                    {
                        roomData && (
                            <TableContainer >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="right">Number</TableCell>
                                            <TableCell align="right">Type</TableCell>
                                            <TableCell align="right">Price</TableCell>
                                            <TableCell align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {roomData && roomData.map((room) => (
                                            <RoomRow room={room} mutate={roomMutate} key={room._id} />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                        )
                    }

                    {
                        roomData && roomData.length <= 0 && (
                            <Alert severity="warning">
                                <AlertTitle>Oops</AlertTitle>
                                No available room.
                            </Alert>
                        )
                    }
                </div>

            </div>

        </>
    )
}


interface RoomRowProps {
    room: Room;
    mutate: MutatorCallback<Room[]>;
}

const RoomRow: React.FC<RoomRowProps> = ({ room, mutate }) => {

    const [openModal, setOpenModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    const [formData, setFormData] = useState({
        name: "",
        roomId: room._id,
        checkInDate: "",
        checkOutDate: "",
    })

    const submit = async () => {
        try {
            const response = await axios.post('/api/book', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            console.log(response);
            setError(null);
            await mutate();
            handleClose();
        } catch (err) {
            if (err instanceof AxiosError) {
                setError(err.message);
            }
        }
    }

    return (

        <TableRow
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <TableCell align="right">{room.roomId}</TableCell>
            <TableCell align="right">{room.roomType}</TableCell>
            <TableCell align="right">{room.price}</TableCell>
            <TableCell align="right">
                <Link to={`#`}>
                    <Button variant="text" disabled={!room.available} onClick={handleOpen}>{room.available ? "Book" : "Booked"}</Button>
                </Link>
            </TableCell>

            <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card className="w-600px pos-absolute transform-translate--50% p-4 top-50% left-50%">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>

                        <form className="flex flex-col gap-8" onSubmit={async (event) => {
                            event.preventDefault()
                            console.log(formData);
                            await submit();
                        }}>

                            <FormControl defaultValue="" required>
                                <FormLabel>Name</FormLabel>
                                <Input name="name" placeholder="Write your name here" onChange={(event) => { setFormData({ ...formData, name: event.target.value }) }} />
                            </FormControl>

                            <div className="flex flex-row gap-4">

                                <FormControl className="flex-auto" required>
                                    <DatePicker name="checkInDate" label={"Check-in Date"} onChange={(e: Dayjs | null) => { e && setFormData({ ...formData, checkInDate: e.unix().toString() }) }} />
                                </FormControl>

                                <FormControl className="flex-auto" required>
                                    <DatePicker name="checkOutDate" label={"Check-out Date"} onChange={(e: Dayjs | null) => { e && setFormData({ ...formData, checkOutDate: e.unix().toString() }) }} />
                                </FormControl>

                            </div>

                            <FormControl required>
                                <FormLabel>Credit Card Number</FormLabel>
                                <Input name="creditCard" type="text" placeholder="Enter your credit card number" />
                            </FormControl>

                            <div className="flex flex-row gap-4">

                                <DatePicker name="expirationDate" label={"Expiration Date"} />

                                <FormControl className="flex-auto" required>
                                    <FormLabel>CVV</FormLabel>
                                    <Input name="cvv" type="text" placeholder="Enter CVV" />
                                </FormControl>

                            </div>


                            <Button type="submit">
                                Book
                            </Button>

                            {
                                error && (
                                    <Alert severity="error">{error}</Alert>
                                )
                            }
                        </form>
                    </LocalizationProvider>

                </Card>
            </Modal>
        </TableRow>
    );
};

export default HotelPage;