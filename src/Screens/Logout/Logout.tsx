import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import useDataLayer from '../../hooks/useDataLayer';

import { activeSessionAction } from '../../redux/states/activeSessionState';
import { IStore } from '../../redux/store';
import { intervalsRefAction } from '../../redux/states/intervalsRefSlice';
import { setAuthToken } from '../../redux/states/authTokenSlice';

const Logout: React.FC = (): JSX.Element => {
  const intervalsRef = useSelector((store: IStore) => store.intervalsRef);
  const {switchSession} = useDataLayer({});
  const dispatch = useDispatch();
  const deleteSession = async (): Promise<void> => {
    clearInterval(intervalsRef.intervalWork);
    clearInterval(intervalsRef.intervalTokenWithWork);
    clearInterval(intervalsRef.intervalToken);
    dispatch(
      intervalsRefAction({
        intervalWork: false,
        intervalTokenWithWork: false,
        intervalToken: false,
      }),
    );
    switchSession(false);
    await AsyncStorage.removeItem('authToken');
    dispatch(setAuthToken(''));
    dispatch(activeSessionAction({active: ''}));
  };
  React.useEffect(() => {
    deleteSession();
  }, []);
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: 'black',
        borderRadius: 100,
      }}
    />
  );
};
export default Logout;
