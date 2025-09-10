
export interface resultType{
  id: string,
  name: string,
  internationalPhoneNumber: string,
  formattedAddress: string,
  shortFormattedAddress: string,
  photos?: {
    googleMapsUri: string
  }[],
  plusCode: {
    globalCode: string,
    compoundCode: string
  },
  location: {
    longitude: number,
    latitude: number,
  },
  rating?: number, 
  googleMapsUri: string,
  websiteUri: string, 
  displayName: {
    text: string, 
    languageCode: string
  },
  primaryTypeDisplayName: {
    text: string,
    languageCode: string
  }, 
  openNow: boolean,
  goodForGroups: boolean,
  goodForWatchingSports: boolean,
  goodForChildren: boolean
}