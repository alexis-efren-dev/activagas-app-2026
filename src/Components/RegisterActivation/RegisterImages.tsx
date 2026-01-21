import React, {useEffect, useState} from 'react';
import {Dimensions, View, Text, Linking} from 'react-native';
import {Button} from 'react-native-paper';
import {Camera} from 'react-native-vision-camera';
import ImageContainer from './ImageContainer';
import ImageContainerCirculation from './ImageContainerCirculation';
import ImageContainerPC from './ImageContainerPC';
import ImageContainerTank from './ImageContainerTank';
import ImageContainerVin from './ImageContainerVin';
import VideoContainer from './VideoContainer';
const {width, height} = Dimensions.get('screen');
interface Props {
  setIsRegisterImages: Function;
  platesSignedUri: any;
  setPlatesSignedUri: any;
  setCirculationSignedUri: any;
  circulationSignedUri: any;
  setVideoSigned: any;
  videoSigned: any;
  vinSignedUri: any;
  setVinSignedUri: any;
  setPcSignedUri: any;
  pcSignedUri: any;
  setTankSignedUri: any;
  tankSignedUri: any;
}
const RegisterImages: React.FC<Props> = ({
  setIsRegisterImages,
  platesSignedUri,
  setPlatesSignedUri,
  circulationSignedUri,
  setCirculationSignedUri,
  setVideoSigned,
  videoSigned,
  vinSignedUri,
  setVinSignedUri,
  pcSignedUri,
  setPcSignedUri,
  tankSignedUri,
  setTankSignedUri,
}) => {
  const [isWithPermission, setIsWithPermission] = useState(false);
  const requestCameraPermission = async () => {
    const isAuthorized = await Camera.requestCameraPermission();
    if (isAuthorized === 'denied' || !isAuthorized) {
      setIsWithPermission(false);
    } else {
      setIsWithPermission(true);
    }
  };
  useEffect(() => {
    requestCameraPermission();
  }, []);
  return (
    <View style={{alignItems: 'center'}}>
      {isWithPermission ? (
        <>
          <ImageContainer
            platesSignedUri={platesSignedUri}
            setPlatesSignedUri={setPlatesSignedUri}
          />
          <ImageContainerCirculation
            circulationSignedUri={circulationSignedUri}
            setCirculationSignedUri={setCirculationSignedUri}
          />
          <ImageContainerVin
            vinSignedUri={vinSignedUri}
            setVinSignedUri={setVinSignedUri}
          />
          <ImageContainerPC
            pcSignedUri={pcSignedUri}
            setPcSignedUri={setPcSignedUri}
          />

          <ImageContainerTank
            tankSignedUri={tankSignedUri}
            setTankSignedUri={setTankSignedUri}
          />
          <VideoContainer
            setVideoSigned={setVideoSigned}
            videoSigned={videoSigned}
          />
        </>
      ) : (
        <View style={{alignItems: 'center'}}>
          <Text style={{fontSize: 17, fontWeight: 'bold', color: 'white'}}>
            Tienes que otorgar permisos a la aplicacion para usar la camara, da
            click en el boton "SOLICITAR PERMISOS", abrira la configuracion de
            la aplicacion, da click en permisos y da permiso a la camara,
            despues regresa y recarga los permisos
          </Text>
          <Button
            style={{
              marginBottom: 20,
              marginTop: 5,
              width: width * 0.9,
              borderRadius: (width * 0.7) / (height / 36),
            }}
            mode="contained"
            buttonColor="#1C9ADD"
            onPress={() => {
              Linking.openSettings();
            }}>
            Solicitar permisos
          </Button>
          <Button
            style={{
              marginBottom: 20,
              marginTop: 5,
              width: width * 0.9,
              borderRadius: (width * 0.7) / (height / 36),
            }}
            mode="contained"
            buttonColor="#1C9ADD"
            onPress={() => {
              requestCameraPermission();
            }}>
            Recargar Permisos
          </Button>
        </View>
      )}

      <Button
        style={{
          marginBottom: 20,
          marginTop: 5,
          width: width / 2,
          borderRadius: (width * 0.7) / (height / 36),
        }}
        mode="contained"
        buttonColor="#1C9ADD"
        onPress={() => {
          setIsRegisterImages(false);
        }}>
        Listo
      </Button>
    </View>
  );
};
export default RegisterImages;
