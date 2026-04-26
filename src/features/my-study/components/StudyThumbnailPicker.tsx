import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { colors } from '../../../styles/colors';

const placeholderImage = require('../../../assets/character/muji_charc.png');
const cameraIcon = require('../../../assets/icon/camera_icon.png');

type StudyThumbnailPickerProps = {
  compact?: boolean;
  imageUri?: string | null;
  onChangeImage?: (uri: string | null) => void;
};

function StudyThumbnailPicker({
  compact = false,
  imageUri,
  onChangeImage,
}: StudyThumbnailPickerProps) {
  const [internalUri, setInternalUri] = useState<string | null>(null);
  const resolvedUri = imageUri ?? internalUri;
  const updateUri = (uri: string | null) => {
    if (onChangeImage) {
      onChangeImage(uri);
    } else {
      setInternalUri(uri);
    }
  };

  const handlePick = () => {
    Alert.alert('이미지 선택', '썸네일을 선택해주세요.', [
      {
        text: '사진 촬영',
        onPress: async () => {
          try {
            const result = await launchCamera({
              mediaType: 'photo',
              quality: 0.8,
            });
            const uri = result?.assets?.[0]?.uri;
            if (uri) {
              updateUri(uri);
            }
          } catch (error) {
            Alert.alert('오류', '카메라를 열 수 없습니다.');
          }
        },
      },
      {
        text: '사진 선택',
        onPress: async () => {
          try {
            const result = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
            });
            const uri = result?.assets?.[0]?.uri;
            if (uri) {
              updateUri(uri);
            }
          } catch (error) {
            Alert.alert('오류', '사진첩을 열 수 없습니다.');
          }
        },
      },
      { text: '취소', style: 'cancel' },
    ]);
  };

  return (
    <View style={[styles.section, compact && styles.sectionCompact]}>
      <View style={styles.thumbnailWrap}>
        <Image
          source={resolvedUri ? { uri: resolvedUri } : placeholderImage}
          style={styles.thumbnail}
          resizeMode={resolvedUri ? 'cover' : 'contain'}
        />
        
      </View>
      <Pressable style={styles.editButton} onPress={handlePick}>
          <Image source={cameraIcon} style={styles.editIcon} />
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 24,
    paddingBottom: 10,
  },
  sectionCompact: {
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  thumbnailWrap: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  editButton: {
    position: 'absolute',
    right: -6,
    bottom: -6,
    width: 35,
    height: 35,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editIcon: {
    width: 19,
    height: 17,
    tintColor: colors.textSecondary,
  },
});

export default StudyThumbnailPicker;
