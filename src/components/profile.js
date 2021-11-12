import { useEffect, useState } from 'react'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Chart } from 'react-google-charts';
import { Circles } from 'react-loading-icons';  
const axios = require("axios");
let chartdata = {};
export default function Profile(props){
    let [files, setFiles] = useState([]);
    let [result,setResult] = useState(0);
    let [filesize,setFilesize] = useState({size:0});
    useEffect(()=>{
        axios.get(`https://cloudsynk-backend.herokuapp.com/users/getfiles/${props.data._id}`,{
          headers:{
            'Content-Type': 'application/json'
          },
          withCredentials: true,
          crossDomain: true
        }).then((res) => {
          console.log(res);
          if(res.status===200){
              chartdata={
                images:0,
                word:0,
                excel:0,
                ppt:0,
                pdf:0
              }
              if(res.data.length>0)
            setFilesize(res.data.reduce((a, b) => ({size: a.size + b.size})))
            setFiles(res.data);
            setResult(1);
          }
        })
        .catch((error) => {
          console.log(error);
          setResult(-1);
        });
    },[props.data._id]);
    return <>
    {
        result > 0?
        <>
        <h1 className="pl-2"> Your Profile</h1>
    <div className="container">
        <div className="row mt-3">
            <div className="col-md-6 mt-3">
                <div className="card h-100">
                    <h3 className="px-2 py-2">Files Uploaded : 
                    <br/></h3>
                    
                    {
                        files.length === 0 ?
                        <h5 className="text-muted text-center px-2 py-2">Nothing much to show here! Start by uploading some files</h5>:
                        <div>
                        {
                            files.forEach((item)=>{
                                item.type.includes("image")?
                                chartdata.images++:(
                                    item.filename.includes("pdf")?
                                    chartdata.pdf++:(
                                        item.filename.includes("doc")?
                                        chartdata.word++:(
                                            item.filename.includes("ppt")?
                                            chartdata.ppt++:
                                            chartdata.excel++
                                        )
                                    )
                                )
                            })
                        }
                        {
                            console.log(chartdata)
                        }
                        <div id="chart_wrap">
                            <div id="chart_div">
                            <Chart
                                height={'200px'}
                                width={'400px'}
                                chartType="PieChart"
                                loader={<div className="pl-3">Loading Chart</div>}
                                data={[
                                ['Files', 'File count'],
                                ['Images', chartdata.images],
                                ['Word', chartdata.word],
                                ['PDF', chartdata.pdf],
                                ['PPT', chartdata.ppt],
                                ['Excel', chartdata.excel],
                                ['Others', 0]
                                ]}
                                rootProps={{ 'data-testid': '1' }}
                            />
                            </div>
                        </div>
                        </div>
                    }
                </div>
            </div>
            <div className="col-md-6 mt-3">
                <div className="card h-100">
                    <h3 className="px-2 pt-2">Space Occupied <br/> <br/> </h3>
                    <span className="pl-2 pr-2">
                    <ProgressBar striped variant="success" now={((filesize.size/1000000).toFixed(2)/100)*100} className="bar"/>  
                    </span>
                    <span className="pt-2 pl-2 pb-2">
                    {(filesize.size/1000000).toFixed(2)}MB/100MB
                    </span>
                </div>
            </div>
        </div>
    </div>
        </>:(
            result === -1?
            <h1> Whoops something went wrong!</h1>:
            <>
        <p className="center"> <Circles stroke="#3ed5ff" fill="#3ed5ff" strokeOpacity={1} speed={1} fillOpacity={1} strokeWidth={3} height="50rem"/></p>
        </>

        )
        

    }
    
    </>
}