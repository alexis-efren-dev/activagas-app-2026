interface Props {
    platesSignedUri: string | boolean;
    circulationSignedUri: string | boolean;
    videoSigned: string | boolean;
    vinSignedUri: string | boolean;
    pcSignedUri: string | boolean;
    tankSignedUri: string | boolean;
  }

  interface PropsSigned {
    platesSignedUri: string | boolean;
    circulationSignedUri: string | boolean;
    videoSigned: string | boolean;
    vinSignedUri: string | boolean;
    pcSignedUri: string | boolean;
    tankSignedUri: string | boolean;
  }
  const updateSelectedImage = async (input: string, signed: any) => {
    if (signed.indexOf('video') > -1) {
      try {
        const vinTransformationBlob = await fetch(input);
        const vinBlob = await vinTransformationBlob.blob();
        await fetch(signed, {
          method: 'PUT',
          body: vinBlob,
          headers: {
            'Content-Type': 'video/mp4',
          },
        });
      } catch (e) {}
    } else {
      try {
        const vinTransformationBlob = await fetch(input);
        const vinBlob = await vinTransformationBlob.blob();
        await fetch(signed, {
          method: 'PUT',
          body: vinBlob,
          headers: {
            'Content-Type': 'image/jpeg',
          },
        });
      } catch (e) {}
    }
  };

  const updateImages = async (data: Props, dataForSigned: PropsSigned) => {
    const parsedDataSigned: any = {...dataForSigned};
    const parsedData: any = {...data};
    const getKeys = Object.keys(parsedData);
    for (let i = 0; i < getKeys.length; i++) {
      if (parsedData[getKeys[i]]) {
        await updateSelectedImage(
          parsedData[getKeys[i]],
          parsedDataSigned[getKeys[i]],
        );
      }
    }
  };

  export default updateImages;
