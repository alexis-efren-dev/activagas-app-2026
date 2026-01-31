import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Video from 'react-native-video';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {useDispatch, useSelector} from 'react-redux';
import {IStore} from '../../redux/store';
import {cameraActiveAction} from '../../redux/states/cameraActiveSlice';
import {getAlertSuccess} from '../../redux/states/alertsReducerState';

const {width} = Dimensions.get('screen');

interface Props {
  setVideoSigned: any;
  videoSigned: any;
}

const VideoContainer: React.FC<Props> = ({
  videoSigned: photoUri,
  setVideoSigned: setPhotoUri,
}) => {
  const [isRecording, setIsRecording] = useState(false);
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
      setIsRecording(true);
      setIsCameraError(false);
      cameraRef.current.startRecording({
        onRecordingFinished: (video: any) => {
          const base64Photo = `file://${video.path}`;
          setPhotoUri(base64Photo);
          setIsActive(false);
          dispatch(cameraActiveAction(false));
          setIsCameraError(false);
          setIsRecording(false);
        },
        onRecordingError: (error: any) => {
          console.error(error);
          setIsCameraError(true);
        },
      });
    } catch (error) {
      console.error(error);
      setIsCameraError(true);
      setIsRecording(false);
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

  // Video recorded view
  if (photoUri && !isActive) {
    return (
      <View style={styles.container}>
        <View style={styles.videoWrapper}>
          <Video
            style={styles.recordedVideo}
            source={{uri: photoUri + '?' + new Date()}}
            paused={false}
            repeat={false}
            controls
            resizeMode="cover"
          />
          <View style={styles.videoOverlay}>
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
          <Icon name="video-plus" size={18} color="#E91E63" />
          <Text style={styles.recaptureButtonText}>Grabar Nuevo Video</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Camera active view (recording)
  if (isActive) {
    return (
      <View style={styles.cameraContainer}>
        <View style={styles.cameraWrapper}>
          <Camera
            video={true}
            style={styles.camera}
            device={device}
            isActive={isActive}
            ref={cameraRef}
          />
          {isRecording && (
            <View style={styles.recordingIndicator}>
              <View style={styles.recordingDot} />
              <Text style={styles.recordingText}>Grabando...</Text>
            </View>
          )}
        </View>

        {isCameraError && (
          <View style={styles.errorBanner}>
            <Icon name="alert-circle" size={16} color="#E53935" />
            <Text style={styles.errorText}>
              Error al grabar, intenta de nuevo
            </Text>
          </View>
        )}

        <View style={styles.cameraButtons}>
          {!isRecording ? (
            <TouchableOpacity
              style={styles.startButton}
              onPress={takePhoto}
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.startButtonGradient}
                colors={['#E91E63', '#C2185B']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Icon name="record-circle" size={20} color="#FFFFFF" />
                <Text style={styles.startButtonText}>Iniciar Grabación</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.stopButton}
              onPress={async () => {
                try {
                  await cameraRef.current.stopRecording();
                } catch (e) {
                  console.log('Error stopping recording');
                }
              }}
              activeOpacity={0.8}>
              <LinearGradient
                style={styles.stopButtonGradient}
                colors={['#F44336', '#D32F2F']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}>
                <Icon name="stop-circle" size={20} color="#FFFFFF" />
                <Text style={styles.stopButtonText}>Detener</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setIsActive(false);
              dispatch(cameraActiveAction(false));
              setIsCameraError(false);
            }}
            activeOpacity={0.8}>
            <Icon name="close" size={18} color="#666" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Initial state - button to open camera
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
        colors={['#E91E63', '#C2185B']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}>
        <Icon name="video-plus" size={20} color="#FFFFFF" />
        <Text style={styles.openCameraButtonText}>Grabar Video</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  videoWrapper: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  recordedVideo: {
    width: width * 0.75,
    height: width * 0.56,
    borderRadius: 12,
    backgroundColor: '#000',
  },
  videoOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
  },
  recaptureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FCE4EC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 12,
    gap: 8,
  },
  recaptureButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E91E63',
  },
  cameraContainer: {
    alignItems: 'center',
    width: '100%',
  },
  cameraWrapper: {
    width: '100%',
    height: width * 0.7,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  recordingIndicator: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 8,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F44336',
  },
  recordingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#C62828',
    fontWeight: '500',
  },
  cameraButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  startButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  startButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  stopButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  stopButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  stopButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  openCameraButton: {
    borderRadius: 12,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  openCameraButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 8,
  },
  openCameraButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default VideoContainer;
