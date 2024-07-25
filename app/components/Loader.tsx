'use client';

import { useState } from 'react';
import { RingLoader } from 'react-spinners';

const Loader = () => {
  const [color, setColor] = useState('#132da0');
   return (
    <div
      className="
      h-[70vh]
      flex 
      flex-col 
      justify-center 
      items-center 
    "
    >
      <RingLoader size={100} color={color} />
    </div>
  );
};

export default Loader;
