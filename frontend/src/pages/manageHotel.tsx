import { Button, Card, Modal, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import useSWR, { MutatorCallback } from 'swr'
import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import PrimarySearchAppBar from '../components/header'
import { fetcher } from '../api'
import { Room } from '../models/Room'
import { EditRoom } from '../components/editRoom'
import axios from 'axios'

function ManageHotelPage() {

  const { data, mutate }: { data?: Room[], mutate: MutatorCallback<Room[]> } = useSWR(`/room?id=${localStorage.getItem('hotelId')}`, fetcher)

  const [searchText, setSearchText] = useState<string>('');

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <>
      <header className='flex flex-row'>
        <PrimarySearchAppBar searchTextHook={[searchText, setSearchText]} />
      </header>

      <div className=' pt-32 flex flex-justify-center '>
        <div className='flex w-80% flex-justify-right'>
          <Button variant="contained" onClick={handleOpen}>Add Room</Button>
        </div>
      </div>

      <TableContainer className='flex flex-justify-center'>
        <Table sx={{ width: 4 / 5 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Number</TableCell>
              <TableCell align="right">Type</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.filter((room) => { return (searchText != '' ? JSON.stringify(room).includes(searchText) : true) }).map((room) => (

              <RoomRow room={room} key={room._id} mutate={mutate} />

            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="w-600px pos-absolute transform-translate--50% p-4 top-50% left-50%">
          <EditRoom mutate={mutate} handleFinish={handleClose} />
        </Card>
      </Modal>
    </>
  )
}

interface RoomRowProps {
  room: Room,
  mutate: MutatorCallback<Room[]>
}

const RoomRow: React.FC<RoomRowProps> = (props) => {

  const { room } = props;

  const [openModal, setOpenModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  const deleteRoom = async () => {
    const response = await axios.post(`/api/room/delete?id=${room._id}`, {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response);
    props.mutate();
  }

  const checkOutRoom = async () => {
    const response = await axios.post(`/api/room/checkout?id=${room._id}`, {
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    console.log(response);
    props.mutate();
  }

  return (
    <>
      <TableRow
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
      >
        <TableCell align="right">{room.roomId}</TableCell>
        <TableCell align="right">{room.roomType}</TableCell>
        <TableCell align="right">{room.price}</TableCell>
        <TableCell align="right">{room.available ? "Available" : "Booked"}</TableCell>
        <TableCell align="right">
          <Link to={`#`}>
            <Button variant="text" onClick={handleOpen}>Edit</Button>
            <Button variant="text" onClick={checkOutRoom} color="warning" disabled={room.available}>CheckOut</Button>
            <Button variant="text" onClick={deleteRoom} color="error" disabled={!room.available}>Delete</Button>
          </Link>
        </TableCell>
      </TableRow>

      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Card className="w-600px pos-absolute transform-translate--50% p-4 top-50% left-50%">
          <EditRoom room={room} mutate={props.mutate} handleFinish={handleClose} />
        </Card>
      </Modal>
    </>
  )
}

export default ManageHotelPage
