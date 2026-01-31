import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useDispatch, useSelector} from 'react-redux';
import {cameraActiveAction} from '../../redux/states/cameraActiveSlice';
import {IStore} from '../../redux/store';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';

const {width} = Dimensions.get('screen');

interface Props {
  setVinSignedUri: any;
  vinSignedUri: any;
}

const ImageContainerVin: React.FC<Props> = ({
  vinSignedUri: photoUri,
  setVinSignedUri: setPhotoUri,
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
    return null;
  }

  if (photoUri && !isActive) {
    return (
      <View style={styles.container}>
        <View style={styles.imageWrapper}>
          <Image
            style={styles.capturedImage}
            source={{uri: photoUri + '?' + new Date()}}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <Icon name="check-circle" size={24} color="#4CAF50" />
          </View>
        </View>
        <TouchableOpacity
          style={styles.recaptureButton}
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
          }}
          activeOpacity={0.8}>
          <Icon name="camera-retake" size={18} color="#1C9ADD" />
          <Text style={styles.recaptureButtonText}>Capturar Nueva</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isActive) {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <Camera
            photo={true}
            style={styles.camera}
            device={device}
            isActive={isActive}
            ref={cameraRef}
          />
        </View>
        {isCameraError && (
          <View style={styles.errorBanner}>
            <Icon name="alert-circle" size={16} color="#E53935" />
            <Text style={styles.errorText}>Error al capturar, intenta de nuevo</Text>
          </View>
        )}
        <View style={styles.cameraButtons}>
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            activeOpacity={0.8}>
            <LinearGradient
              style={styles.captureButtonGradient}
              colors={['#4CAF50', '#388E3C']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Icon name="camera" size={20} color="#FFFFFF" />
              <Text style={styles.captureButtonText}>Capturar</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsActive(false);
              dispatch(cameraActiveAction(false));
              setIsCameraError(false);
            }}
            activeOpacity={0.8}>
            <Icon name="close" size={18} color="#E53935" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={styles.openCameraButton}
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
      }}
      activeOpacity={0.8}>
      <LinearGradient
        style={styles.openCameraButtonGradient}
        colors={['#1C9ADD', '#0D7ABC']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Icon name="camera-plus" size={20} color="#FFFFFF" />
        <Text style={styles.openCameraButtonText}>Tomar Foto</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {alignItems: 'center'},
  imageWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.1, shadowRadius: 6},
      android: {elevation: 3},
    }),
  },
  capturedImage: {width: width * 0.75, height: width * 0.5, borderRadius: 12},
  imageOverlay: {position: 'absolute', top: 8, right: 8, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 4},
  recaptureButton: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E3F2FD', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginTop: 12, gap: 8},
  recaptureButtonText: {fontSize: 14, fontWeight: '600', color: '#1C9ADD'},
  cameraContainer: {alignItems: 'center', width: '100%'},
  cameraWrapper: {width: '100%', height: width * 0.7, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000'},
  camera: {flex: 1},
  errorBanner: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, marginTop: 12, gap: 8},
  errorText: {fontSize: 13, color: '#C62828', fontWeight: '500'},
  cameraButtons: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 12},
  captureButton: {borderRadius: 12, overflow: 'hidden'},
  captureButtonGradient: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, gap: 8},
  captureButtonText: {fontSize: 15, fontWeight: '600', color: '#FFFFFF'},
  cancelButton: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFEBEE', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, gap: 6},
  cancelButtonText: {fontSize: 15, fontWeight: '600', color: '#E53935'},
  openCameraButton: {borderRadius: 12, overflow: 'hidden', alignSelf: 'center'},
  openCameraButtonGradient: {flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 24, gap: 8},
  openCameraButtonText: {fontSize: 15, fontWeight: '600', color: '#FFFFFF'},
});

export default ImageContainerVin;
