import React from 'react';

import HomeGenericPlates from '../../../Components/HomeGenericPlates/HomeGenericPlates';

const HomePlates = (props: any) => {
  return (
    <HomeGenericPlates
      accounting={true}
      navigation={props.navigation}
      refresh={props.route.params}
    />
  );
};

export default HomePlates;
