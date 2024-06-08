import {Dimensions,PixelRatio} from 'react-native';

//Device size
export const Height = Dimensions.get('window').height;
export const HeightPercent = (val) => {
    return PixelRatio.roundToNearestPixel((Height*val)/100);
}
export const Width = Dimensions.get('window').width;
export const WidthPercent = (val) => {
    return PixelRatio.roundToNearestPixel((Width*val)/100);
}