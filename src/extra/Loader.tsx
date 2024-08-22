import React from 'react';
import { useSelector } from 'react-redux';
import { isLoading } from '../util/ApiInstance';
import { useAppSelector } from '@/store/store';

export default function Loader() {
  const roleLoader = useSelector((state) => isLoading(state));
  console.log("roleLoader", roleLoader)
  return (
    <>
      {roleLoader  && (
        <>
          <div className='mainLoaderBox loader-new'>
            <div className="loading">
              <div className="d1"></div>
              <div className="d2"></div>
            </div>
          </div>
          {/*  <div className='mainLoader'>
   <div className="lds-ripple">
     <div></div>
   </div>
 </div> */}
        </>
      )}
    </>
  );
}
