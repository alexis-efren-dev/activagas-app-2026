import React from 'react';
import HomeGenericPlates from '../../../Components/HomeGenericPlates/HomeGenericPlates';

const HomePlatesVerification = (props: any) => {
  return (
    <>
      <HomeGenericPlates navigation={props.navigation} verification={props.route.params.item._id} />
    </>
  );
};

export default HomePlatesVerification;
