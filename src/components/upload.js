import {useDropzone} from 'react-dropzone';
import React, {useMemo,useEffect, useState} from 'react';
import { toast } from 'react-toastify';
import { Oval } from 'react-loading-icons';
import 'react-toastify/dist/ReactToastify.css';
const axios = require("axios");
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#3ed5ff',
    borderStyle: 'dashed',
    backgroundColor:"#27273a",
    color: '#3ed5ff',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
export default function Upload(props){
  let [click,setClick] = useState(0);
  let [filesize,setFilesize] = useState({size:0});
  useEffect(()=>{
    axios.get(`https://cloudsynk-backend.herokuapp.com/users/getfiles/${props.data._id}`,{
      headers:{
        'Content-Type': 'application/json'
      },
      withCredentials: true,
      crossDomain: true
    }).then((res) => {
      //console.log(res);
      if(res.status===200){
          
        if(res.data.length>0){
          setFilesize(res.data.reduce((a, b) => ({size: a.size + b.size})));
        }
      }
    })
    .catch((error) => {
      console.log(error);
    });
},[props.data._id]);
    const [files, setFiles] = useState([]);
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        acceptedFiles
      } = useDropzone({
          accept: 'image/jpg,.jpeg,.png,.gif,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx',
            onDrop: acceptedFiles => {
                setFiles([...files, acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
                }))]);
                
      }});
      const files1 = acceptedFiles.map(file => (
        <span key={file.path}>
          {file.path} - {file.size} bytes
        </span>
      ));
      useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        files.forEach(file => URL.revokeObjectURL(file.preview));
      }, [files]);
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);
    let clearfiles = ()=>{
      acceptedFiles.length=0;
      setFiles([]);
    }
    let submitfiles = ()=>{
      setClick(1);
      let currentfilesize = acceptedFiles.reduce((a, b) => ({size: a.size + b.size}));
      let totalfilesize = filesize.size+currentfilesize.size;
      console.log(acceptedFiles);
        if(acceptedFiles.length===0){
          toast.error("Please select files to upload");
          setClick(0);
        }
        else if(totalfilesize > 100000000)
        toast.error("Sorry! your file size will exceed your alloted quota");
        else{
          let index = 0;
        acceptedFiles.forEach((tempfile)=>{
            let fileup = new FormData();
            fileup.append("image",tempfile,tempfile.name);
            axios.post("https://cloudsynk-backend.herokuapp.com/api/uploadImage",fileup).then((result)=>{
              axios.put(`https://cloudsynk-backend.herokuapp.com/users/storefiles/${props.data._id}`,{
                filename:tempfile.name,
                size:tempfile.size,
                type:tempfile.type,
                downloadurl:result.data.downloadUrl
              }).then((final=>{
                toast.success(`Uploaded ${tempfile.name} successfully`);
                index++;
                setFiles([]);
                if(index===acceptedFiles.length){
                  acceptedFiles.length=0;
                  setClick(0);
                } 
              })).catch((error)=>{
                console.log(error)
                toast.warning(`File Upload ${tempfile.name} but download URL unavailable`);
                setClick(0);
              })
            }).catch((error)=>{
            console.log(error);
            toast.error(`Couldn't Upload ${tempfile.name}`);
            setClick(0);
            })
        })
      } 
    }
    return <>
    <div className="container pt-5">
      <div {...getRootProps({style})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        <br/>
        <p>Accepted file formats <br/>
        .pdf .doc .docx .xls .xlsx .ppt .pptx .jpeg .jpg .png .gif
        </p>
      </div>
      {
          files1.length>0?
          <div>
          <h4 className="pt-4"> Selected Files</h4>
            
            {
                
                files1.map((items)=>{
                    return <div key={items.name}>
                    <button type="button" className="btn btn-success mx-2 my-2">{items}</button>
                    </div>
                })
            }
          </div>: <div></div>
      }
      
      <div>
        <button type="submit" className="btn btn-info mt-3 mb-3" onClick={submitfiles}>{click === 0 ? <span>Submit</span>: <span>Loading... <Oval stroke="#ffffff" fill="#000000" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="1.5rem"/></span>}</button>
        <button type="button" className="btn btn-warning mx-3 my-3" onClick={clearfiles}>Clear</button>
      </div>
    </div>
    </>
}