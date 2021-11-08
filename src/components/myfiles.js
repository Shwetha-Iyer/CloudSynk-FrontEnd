import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { useEffect, useState } from 'react';
import { Circles } from 'react-loading-icons';
const axios = require("axios");
export default function Myfiles(props){
    let [page,setPage] = useState(0);
    let [files,setFiles] = useState([]);
    useEffect(()=>{
        axios.get(`http://localhost:3100/users/getfiles/${props.data._id}`,{
          headers:{
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          crossDomain: true
        }).then((res) => {
          if(res.status===200){
            setFiles(res.data);
            setPage(1);
          }
        })
        .catch((error) => {
          console.log(error);
            toast.error("Something went wrong!");
            setPage(-1);
        });
    },[props.data._id]);
    return <>
    {
        page === 0?
        <p className="center"> <Circles stroke="#3ed5ff" fill="#3ed5ff" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="50rem"/></p>:
        (page===-1?
            <h1>Can't find what you are looking for...</h1>:
            <>
            {
                files.length > 0?
                <>
                <h1> &nbsp;Your Files</h1>
            <div className="container">
                <div className="row">
                {
                    files.map((item)=>{
                        return <div className="col-lg-2 col-sm-4 col-md-3 col-6 text-center" key={item.downloadurl}>
                                {
                                    item.type.includes("image")?
                                    <a href={item.downloadurl} rel="noreferrer">
                                        <div>
                                        <img src="../images/imageicon.png" height="110%" width="100%" alt="imgfile"/>
                                        <p className="App-link">{item.filename}</p>
                                        </div>
                                    </a>
                                    :(
                                        item.filename.includes("xls")?
                                        <a href={item.downloadurl} rel="noreferrer">
                                        <div>
                                        <img src="../images/excel.png" height="100%" width="100%" alt="xlsfile"/>
                                        <p className="App-link">{item.filename}</p>
                                        </div>
                                        </a>
                                        :(
                                            item.filename.includes("doc")?
                                            <a href={item.downloadurl} rel="noreferrer">
                                            <div>
                                            <img src="../images/word.png" height="100%" width="100%" alt="docfile"/>
                                            <p className="App-link">{item.filename}</p>
                                            </div>
                                            </a>
                                            :(
                                                item.filename.includes("ppt")?
                                                <a href={item.downloadurl} rel="noreferrer">
                                                <div>
                                                <img src="../images/ppt.png" height="100%" width="100%" alt="pptfile"/>
                                                <p className="App-link">{item.filename}</p>
                                                </div>
                                                </a>
                                                :(
                                                    <a href={item.downloadurl} rel="noreferrer">
                                                    <div>
                                                    <img src="../images/pdf.png" height="100%" width="100%" alt="pdffile"/>
                                                    <p className="App-link">{item.filename}</p>
                                                    </div>
                                                    </a>
                                                )
                                            )
                                        )
                                    )
                                }
                            </div>
                    })
                }
                </div>
            </div>
                </>:
                <h2 className="text-center px-5 py-5">Meh! Nothing to see here</h2>
            }
            </>
            
        )
    }
    </>
}