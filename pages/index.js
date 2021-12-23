import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Fragment } from 'react';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useRef } from 'react';
import db from '../db';

export default function Home({ data }) {
  const [messages, setMessages] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const valueRef = useRef('');

  const handlePost = () => {
    const message = valueRef.current.value;

    const id = Date.now();
    
    const params = {
      TableName: process.env.TABLE_NAME,
      Item: {
        'id': {S: id.toString()},
        'message': {S: message}
      }
    }
    db.putItem(params, (err, data) => {
      if (err) console.log("Error", err);
      else {
        console.log("Sucess", data)
        valueRef.current.value = '';
        setIsLoading(true);
      };
    })
  }

  useEffect(() => {
    const dynamicReload = async () => {
      const params = {
        TableName: process.env.TABLE_NAME
      }
      const res = await db.scan(params).promise()
      let data = res.Items
      setMessages(data)
    }
    if (isLoading) {
      dynamicReload();
    }
    setIsLoading(false);
  }, [isLoading])

  return (
    <Fragment>
      {console.log(data)}
      <Paper elevation={2} sx={{ backgroundColor: '#0052cc' }}>
        <Typography
          variant="h3"
          component="div"
          align="center"
          gutterBottom
          sx={{ color: 'white' }}
        >
          Welcome!!
        </Typography>
      </Paper>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-multiline-static"
          label="Message"
          multiline
          rows={4}
          placeholder="Message"
          inputRef={valueRef}
        />
        <Button
          variant="outlined"
          sx={{ m: 1 }}
          onClick={handlePost}
        >
          Post
        </Button>
      </Box>
      <Divider sx={{ color: '#0052cc' }}>Past Messages</Divider>

      {messages.length != 0 ? (
        <Box sx={{ m: 1 }}>
          {messages.map((message) => (
            <Typography variant="body1" component="div" key={message.id.S} gutterBottom>
              {message.message.S}
            </Typography>
          ))}
        </Box>
      ) : null}

    </Fragment>
  );
}



export async function getServerSideProps() {
  const params = {
    TableName: process.env.TABLE_NAME
  }

  const res = await db.scan(params).promise()
  let data = res.Items
  return {
    props: {
      data
    }
  }
}