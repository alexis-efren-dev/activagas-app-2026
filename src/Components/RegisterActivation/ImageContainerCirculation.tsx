/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useDispatch, useSelector} from 'react-redux';
import { IStore } from '../../redux/store';
import { cameraActiveAction } from '../../redux/states/cameraActiveSlice';
import { getAlertSuccess } from '../../redux/states/alertsReducerState';

const {width, height} = Dimensions.get('screen');
interface Props {
  circulationSignedUri: any;
  setCirculationSignedUri: any;
}
const ImageContainerCirculation: React.FC<Props> = ({
  circulationSignedUri: photoUri,
  setCirculationSignedUri: setPhotoUri,
}) => {
  const [isCameraError, setIsCameraError] = useState(false);
  const dispatch = useDispatch();
  const {isCameraGlobalActive} = useSelector(
    (store: IStore) => store.cameraActiveGlobal,
  );
  const cameraRef: any = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const devices = useCameraDevices();
  const device = devices[0];

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) {
        setIsCameraError(true);
      } else {
        const photo = await cameraRef.current.takePhoto();

        const base64Photo = `file://${photo.path}`;

        setPhotoUri(base64Photo);
        setIsActive(false);
        dispatch(cameraActiveAction(false));
        setIsCameraError(false);
      }
    } catch (error) {
      console.error(error);
      setIsCameraError(true);
    }
  };
  useEffect(() => {
    async function getPermission() {
      const isAuthorized = await Camera.requestCameraPermission();
      if (!isAuthorized) {
        setIsCameraError(true);
      }
    }
    getPermission();
  }, []);

  if (device == null) {
    return <></>;
  }
  return (
    <View style={{flex: 1}}>
      {photoUri && !isActive ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image
            style={{width: width * 0.8, height: height / 4}}
            source={{uri: photoUri + '?' + new Date()}}
          />
          <Button
            style={{
              marginBottom: 20,
              marginTop: 20,
              width: width / 1.2,
              borderRadius: (width * 0.7) / (height / 36),
            }}
            mode="contained"
            color="#1C9ADD"
            onPress={() => {
              if (isCameraGlobalActive) {
                dispatch(
                  getAlertSuccess({
                    message: '',
                    show: false,
                    messageError: 'Debes cerrar el proceso de la otra camara',
                    showError: true,
                  }),
                );
              } else {
                setPhotoUri(null);
                setIsActive(true);
                dispatch(cameraActiveAction(true));
                setIsCameraError(false);
              }

              //uploadPhoto();
            }}>
            Capturar nueva imagen
          </Button>
        </View>
      ) : isActive ? (
        <View
          style={{
            height: height / 2,
            width: width * 0.9,
          }}>
          <Camera
            photo={true}
            style={{flex: 1}}
            device={device}
            isActive={isActive}
            ref={cameraRef}
          />
          <Button
            style={{
              marginBottom: 30,
              marginTop: 30,
              borderRadius: (width * 0.7) / (height / 36),
            }}
            mode="contained"
            color="#1C9ADD"
            onPress={async () => {
              takePhoto();
            }}>
            Capturar
          </Button>
          {isCameraError && (
            <Text style={{color: 'red'}}>
              Error al capturar foto, intenta de nuevo
            </Text>
          )}
          <Button
            style={{
              marginBottom: 30,
              marginTop: 30,
              borderRadius: (width * 0.7) / (height / 36),
            }}
            mode="contained"
            color="#1C9ADD"
            onPress={() => {
              setIsActive(false);
              dispatch(cameraActiveAction(false));
              setIsCameraError(false);
            }}>
            CANCELAR
          </Button>
        </View>
      ) : (
        <Button
          style={{
            marginBottom: 20,
            marginTop: 5,
            borderRadius: (width * 0.7) / (height / 36),
          }}
          mode="contained"
          color="#1C9ADD"
          onPress={() => {
            if (isCameraGlobalActive) {
              dispatch(
                getAlertSuccess({
                  message: '',
                  show: false,
                  messageError: 'Debes cerrar el proceso de la otra camara',
                  showError: true,
                }),
              );
            } else {
              setIsActive(true);
              dispatch(cameraActiveAction(true));
            }
          }}>
          Registrar Numero Circulacion
        </Button>
      )}
    </View>
  );
};

export default ImageContainerCirculation;
