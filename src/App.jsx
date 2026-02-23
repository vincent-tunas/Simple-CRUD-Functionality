
//import the necessary modules
import React, { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

//main function of the crud functionality application
function App() {
  // the variables users, name, email and userEdit
  const [users, setUsers] = useState([]);
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const[userEdit, setUserEdit] = useState(null);

  // get the VITE_API_URL from the .env file, this will be used to make requests to the backend server (json server )
  const API_URL = import.meta.env.VITE_API_URL;

  //Run getAllData function once in the beginning when the component is mounted, this function will fetch all the data from the backend server
  useEffect(()=>{
    getAllData();
  },[]);
  
  // display the data
  async function getAllData(){
    const response = await axios.get(API_URL);
    console.log(response.data);
    setUsers(response.data);
  }
  // tambah data
  async function addData(e){
    e.preventDefault();// dont refresh the page when data is added
    //if either name or email is empty, return and do nothing
    if(!name || !email){
      return;
    }
    //bila ada isi, panggil axios untuk post user data input (name, email) ke dalam url datastorage kita dan store name dan email
    const response = await axios.post(API_URL,{name,email});
    //clear input fields
    setName('');
    setEmail('');
    //refresh the data list with the new data
    getAllData();
  } 

  //delete data
  async function deleteData(id){
    const response = await axios.delete(API_URL+"/"+id);
    getAllData();
  }
  //edit data
  function editData(data){
    setUserEdit(data);
    setName(data.name);
    setEmail(data.email);
  }
  
  //update data
  async function updateData(e){
    e.preventDefault(e);
    if(!name || !email){
      return;
    }
    //bila ada isi, panggil axios untuk post ke dalam url datastorage kita dan store name dan email
    const response =await axios.put(API_URL+"/"+userEdit.id,{name, email});
    //SET the input box into empty again, when the post request to the data storage
    setName('');
    setEmail('');
    //show all the data updated
    getAllData();
  }

  //the handleclick function is used to determine whether the user adds a data or is updating a data
  async function handleClick(e){
    e.preventDefault();
    // if useredit is active, wait for the data to be updated, else wait for the data to be added
    //because of preventdefault, the data of the user input is not passed to be editted to the backend, it needs to be added as a parameter to both updateData and addData functions
    if(userEdit){
      await updateData(e);
    }else{
      await addData(e);
    }
  }

  return (
      <div className='wrapper'>
        <div className='header'>
          <h3>{userEdit?'Edit Pengguna':'Tambah Pengguna'}</h3>
          <form className='input-box' onSubmit={handleClick}>
            <input type='text' placeholder='Nama' value={name} onChange={(e)=>setName(e.target.value)}/>
            <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type='submit'>{userEdit?'Update Data':'Tambah Data'}</button> 
          </form>
        </div>
        <div className='data-pengguna'>
        <h3>Data Pengguna</h3>
            <ul>
              {
                users.map((user)=>( // fungsi ini nge-map user dengan nama yang ada di person list
                  <li>
                    <div>
                      {user.name} <span className='email'>
                      ({user.email})</span>
                    </div>
                    <div>
                      <a href='#' className='edit' onClick={()=>editData(user)}>Edit</a> - <a href='#' className='delete' onClick={()=>deleteData(user.id)}>Delete</a>
                    </div>
                </li>
              
                ))
              }
              </ul>
        </div>
      </div>
    )
}

export default App