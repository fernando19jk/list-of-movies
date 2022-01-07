import React, {useState, useEffect,useRef} from 'react'
import { FlatList,View,Image,TouchableOpacity,Text,Linking,ImageBackground } from 'react-native'
import {LinearGradient} from 'expo-linear-gradient'
import { StatusBar } from 'expo-status-bar'
import { AppLoading } from 'expo'
import { useFonts } from 'expo-font';
import styled from 'styled-components/native'
import Rating from './components/Rating'
import Genre from './components/Genre'
import { getMovies } from './api'
import * as CONSTANTS from './constants/constants'
import { Animated } from 'react-native';
import trailer from './constants/constants'
const Container = styled.View`
flex: 1;
padding-top:50px;
background-color:#000;
`
const PosterContainer = styled.View`
width: ${CONSTANTS.ITEM_SIZE}px;
margin-top: ${CONSTANTS.TOP}px;
`
const Poster = styled.View`
margin-horizontal: ${CONSTANTS.SPACING}px;
 padding: ${CONSTANTS.SPACING * 2}px; 
 align-items: center; 
 background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;

`

const PosterImage = styled.Image`
width: 100%; 
height: ${CONSTANTS.ITEM_SIZE * 1.2}px;
 resize-mode: cover;
  border-radius: 10px;
   margin: 0 0 10px 0;

`

const PosterTitle = styled.Text`
font-family: Syne-Mono;
 font-size: 18px;
color:#FFF;
`

const PosterDescription = styled.Text`
font-family: Syne-Mono; 
font-size: 12px;
color:#FFF;
`


const DummyContainer=styled.View`
width:${CONSTANTS.SPACER_ITEM_SIZE}px;
`
const ContentContainer=styled.View`
position:absolute;
width:${CONSTANTS.WIDTH}px;
height:${CONSTANTS.BACKDROP_HEIGHT}px;
`
const BackdropContainer=styled.View`
width:${CONSTANTS.WIDTH}px;
position:absolute;
height:${CONSTANTS.BACKDROP_HEIGHT}px;
overflow:hidden;
`
const BackdropImage=styled.Image`
position:absolute;
width:${CONSTANTS.WIDTH}px;
height:${CONSTANTS.BACKDROP_HEIGHT}px;
`


export default function App(){

  const [tra, setTra] = useState(null);
const [movies,setMovies]=useState([])
const [loaded,setLoaded]=useState(false)
useEffect(()=>{
const fetchData=async()=>{
  const data=await getMovies()
  setMovies([{key:'left-spacer' }, ...data, {key:'right-spacer'}])
  setLoaded(true)
}
fetchData()
},[])

const scrollX=useRef(new Animated.Value(0)).current
let [fontLoaded]=useFonts({
  'Syne-Mono':require('./assets/SyneMono-Regular.ttf'),
});




// if(!loaded || !fontLoaded){
//   return <AppLoading/>;
// }


  
const Hi=()=>{
  return       <Image style={{flex:2}} source={{uri:'https://image.tmdb.org/t/p/w500/1Rr5SrvHxMXHu5RjKpaMba8VTzi.jpg'}}></Image>

}
return(
  
<Container>
<ContentContainer>
       {/* <Text style={{color:"white"}}>0A000</Text> */}
      {/* <Image style={{flex:1}} source={{uri:'https://image.tmdb.org/t/p/w500/o76ZDm8PS9791XiuieNB93UZcRV.jpg'}}></Image>  */}

<FlatList
  data={movies}
  keyExtractor={item => `${item.key}-back`}
  removeClippedSubviews={false}
  contentContainerStyle={{ width: CONSTANTS.WIDTH,height: CONSTANTS.BACKDROP_HEIGHT}}
  renderItem={({item, index}) => {
    // if(!item.backdropPath) {

    // return null
    // }
    var a=0;
   // console.log(a+1);

  const translateX = scrollX.interpolate({
  inputRange: [(index - 1) * CONSTANTS.ITEM_SIZE, index * CONSTANTS.ITEM_SIZE],
  outputRange: [0, CONSTANTS.WIDTH]
  })

return( 
    <BackdropContainer
     as={Animated.View}
    style={{transform:[{ translateX: translateX }]}}
    >
      <BackdropImage source={{uri:item.posterPath}} />
      </BackdropContainer>
    )
    }}
    />
    <LinearGradient
    colors={['rgba(0,0,0,0)','black']}
    style={{
      height:CONSTANTS.BACKDROP_HEIGHT,
      width:CONSTANTS.WIDTH,
      position:'absolute',
      bottom:0,
    }}
    />
  
    </ContentContainer>
  {/* <Hi></Hi> */}
<StatusBar/>
 <Animated.FlatList
showsHorizontalScrollIndicator={false}
 data={movies}
  keyExtractor={item => item.key}
   horizontal
    contentContainerStyle={{
      alignItems: 'center'
   }} 
   snapToInterval={CONSTANTS.ITEM_SIZE}
   decelerationRate={0}
   onScroll={Animated.event(
    [{nativeEvent:{contentOffset:{x:scrollX}}}],
    {useNativeDriver:true}
 )}

 scrollEventThrottle={16}


renderItem={({ item,index }) =>{
  const inputRange=[
    (index - 2)*CONSTANTS.ITEM_SIZE,
    (index - 1)* CONSTANTS.ITEM_SIZE,
    index * CONSTANTS.ITEM_SIZE

  ]

  const translateY=scrollX.interpolate({
    inputRange,
    outputRange:[0,-50,0]
  })
  if(!item.originalTitle){
    return <DummyContainer/>
  }
  const trailerOrder=(a)=> {
    //console.log(a);
    if(a==1)
    {
      setTra("https://www.youtube.com/watch?v=JfVOs4VSpmA")
    }if(a==2){
      setTra("https://www.youtube.com/watch?v=4q6UGCyHZCI")

    }if(a==3){
      setTra("https://www.youtube.com/watch?v=CaimKeDcudo")
    }if(a==4){
      setTra("https://www.youtube.com/watch?v=9ix7TUGVYIo")
    }if(a==5){
      setTra("https://www.youtube.com/watch?v=-FmWuCgJmxo")
    }
   console.log("entra");
  }
  
   
   return(
      <PosterContainer>
         <Poster as={Animated.View} style={{transform:[{translateY}]}}>
           <TouchableOpacity onPress={ ()=>{trailerOrder(index);Linking.openURL(tra)}}>
             <Text style={{color:"white"}}>Watch Trailer</Text>
             <Text></Text>
           </TouchableOpacity>
            <PosterImage source={{ uri: item.posterPath }} /> 
            <PosterTitle numberOfLines={1}>{item.originalTitle}</PosterTitle>
            <Rating rating={item.voteAverage} /> 
            <Genre genres={item.genres} />
            <PosterDescription numberOfLines={5}>{item.description}</PosterDescription>
        </Poster>
 </PosterContainer>
)
}}
/>
</Container>
);  

}