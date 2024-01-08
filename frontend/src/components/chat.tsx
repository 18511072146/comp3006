import { Button, List, ListItem, TextField } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';

const style = {
    py: 0,
    width: '100%',
    maxWidth: 360,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'divider',
    backgroundColor: 'background.paper',
};

function Chat() {
    const [message, setMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState<MessageEvent[]>([]);
    const { sendMessage, lastMessage } = useWebSocket(`${import.meta.env.VITE_WS_URL}/ws`);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory(prevMessageHistory => [lastMessage, ...prevMessageHistory]);
        }
    }, [lastMessage]);

    const handleClickSendMessage = useCallback(() => {
        if (message.length != 0) {
            sendMessage(message);
            setMessage('');
            return
        }
        window.alert('Input should never be null')
    }, [message, sendMessage]);

    return (
        <div className='flex flex-col p-4'>
            <div className='flex flex-row gap-4'>
                <TextField
                    id="standard-basic"
                    label="Message"
                    variant="standard"
                    type="text"
                    className='flex-auto'
                    onChange={(e) => setMessage(e.target.value)} value={message}
                />
                <Button onClick={handleClickSendMessage} variant="contained">Send</Button>
            </div>
            <List className='flex flex-col gap-2'>
                {messageHistory.map((msg, index) => (
                    <ListItem sx={style} key={index} >
                        <p className=''>{msg.data}</p>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}

export default Chat;
