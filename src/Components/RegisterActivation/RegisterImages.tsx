import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  Linking,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Camera} from 'react-native-vision-camera';
import ImageContainer from './ImageContainer';
import ImageContainerCirculation from './ImageContainerCirculation';
import ImageContainerPC from './ImageContainerPC';
import ImageContainerTank from './ImageContainerTank';
import ImageContainerVin from './ImageContainerVin';
import VideoContainer from './VideoContainer';

const {width} = Dimensions.get('screen');

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

  const completedCount = [
    platesSignedUri,
    circulationSignedUri,
    vinSignedUri,
    pcSignedUri,
    tankSignedUri,
    videoSigned,
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="camera" size={28} color="#FF9800" />
        </View>
        <Text style={styles.headerTitle}>Registrar Imágenes</Text>
        <Text style={styles.headerSubtitle}>
          Captura las fotografías y video requeridos
        </Text>
      </View>

      {/* Progress Badge */}
      <View style={styles.progressBadge}>
        <Icon name="checkbox-marked-circle" size={18} color="#4CAF50" />
        <Text style={styles.progressText}>
          {completedCount} de 6 completados
        </Text>
      </View>

      {isWithPermission ? (
        <View style={styles.imagesContainer}>
          {/* Images Grid */}
          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="card-account-details" size={18} color="#1C9ADD" />
              <Text style={styles.imageCardTitle}>Placas del Vehículo</Text>
              {platesSignedUri && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <ImageContainer
              platesSignedUri={platesSignedUri}
              setPlatesSignedUri={setPlatesSignedUri}
            />
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="file-document" size={18} color="#1C9ADD" />
              <Text style={styles.imageCardTitle}>Tarjeta de Circulación</Text>
              {circulationSignedUri && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <ImageContainerCirculation
              circulationSignedUri={circulationSignedUri}
              setCirculationSignedUri={setCirculationSignedUri}
            />
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="barcode" size={18} color="#1C9ADD" />
              <Text style={styles.imageCardTitle}>Número VIN</Text>
              {vinSignedUri && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <ImageContainerVin
              vinSignedUri={vinSignedUri}
              setVinSignedUri={setVinSignedUri}
            />
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="car" size={18} color="#1C9ADD" />
              <Text style={styles.imageCardTitle}>Computadora del Vehículo</Text>
              {pcSignedUri && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <ImageContainerPC
              pcSignedUri={pcSignedUri}
              setPcSignedUri={setPcSignedUri}
            />
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="gas-cylinder" size={18} color="#1C9ADD" />
              <Text style={styles.imageCardTitle}>Tanque de Gas</Text>
              {tankSignedUri && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <ImageContainerTank
              tankSignedUri={tankSignedUri}
              setTankSignedUri={setTankSignedUri}
            />
          </View>

          <View style={styles.imageCard}>
            <View style={styles.imageCardHeader}>
              <Icon name="video" size={18} color="#E91E63" />
              <Text style={styles.imageCardTitle}>Video del Vehículo</Text>
              {videoSigned && (
                <Icon name="check-circle" size={18} color="#4CAF50" />
              )}
            </View>
            <VideoContainer
              setVideoSigned={setVideoSigned}
              videoSigned={videoSigned}
            />
          </View>
        </View>
      ) : (
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconContainer}>
            <Icon name="camera-off" size={48} color="#E53935" />
          </View>
          <Text style={styles.permissionTitle}>Permisos Requeridos</Text>
          <Text style={styles.permissionText}>
            Para capturar imágenes y video, necesitas otorgar permisos de cámara
            a la aplicación. Toca el botón para abrir la configuración.
          </Text>

          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => Linking.openSettings()}
            activeOpacity={0.8}>
            <LinearGradient
              style={styles.permissionButtonGradient}
              colors={['#1C9ADD', '#0D7ABC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}>
              <Icon name="cog" size={20} color="#FFFFFF" />
              <Text style={styles.permissionButtonText}>Abrir Configuración</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reloadButton}
            onPress={requestCameraPermission}
            activeOpacity={0.8}>
            <Icon name="refresh" size={20} color="#1C9ADD" />
            <Text style={styles.reloadButtonText}>Recargar Permisos</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Done Button */}
      <TouchableOpacity
        style={styles.doneButton}
        onPress={() => setIsRegisterImages(false)}
        activeOpacity={0.8}>
        <LinearGradient
          style={styles.doneButtonGradient}
          colors={['#4CAF50', '#388E3C']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Icon name="check" size={22} color="#FFFFFF" />
          <Text style={styles.doneButtonText}>Listo</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: width * 0.9,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginBottom: 20,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  imagesContainer: {
    width: '100%',
  },
  imageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  imageCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  imageCardTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  permissionIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  permissionButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  permissionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 10,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  reloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E3F2FD',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    gap: 10,
  },
  reloadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C9ADD',
  },
  doneButton: {
    width: width * 0.6,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4CAF50',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  doneButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 10,
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default RegisterImages;
