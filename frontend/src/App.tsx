import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import useSWR from 'swr'
import { fetcher } from './api'
import { Hotel } from './models/Hotel'
import { Link } from 'react-router-dom'
import PrimarySearchAppBar from './components/header'
import { useState } from 'react'

function App() {

  const { data }: { data?: Hotel[] } = useSWR('/hotels', fetcher)

  const [searchText, setSearchText] = useState<string>('');

  return (


    <>
      <header className='flex flex-row'>
        <PrimarySearchAppBar searchTextHook={[searchText, setSearchText]} />
      </header>
      <TableContainer className='pt-100px flex flex-justify-center'>
        <Table sx={{ width: 4 / 5 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Location</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.filter((hotel) => { return (searchText != '' ? JSON.stringify(hotel).includes(searchText) : true) }).map((hotel) => (
              <TableRow
                key={hotel._id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.phone}</TableCell>
                <TableCell>{hotel.location}</TableCell>
                <TableCell align="right">
                  <Link to={`/hotel/${hotel._id}`}>
                    <Button variant="text">Rooms</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default App
