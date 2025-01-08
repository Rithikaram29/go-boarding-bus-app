import React from 'react'
import NavBar from '../components/NavBar'
import BusFormComponent from '../components/adminComponents/AddBus'

const AddBusPage: React.FC = () => {
  return (
   <>
   <NavBar/>
   <div><BusFormComponent/>

   </div>
   
   </>
  )
}

export default AddBusPage