import {  StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native-paper'

const Returnbutton = ({goBack, style, text, icon}:any) => {
  return (
    <Button
    icon={icon? icon:"arrow-left-circle"}
    mode="contained"
    onPress={goBack}
    style={ style? style:styles.button}
  >  {text?text:'Go Back'} 
  </Button>
  )
}

export default Returnbutton

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
      },
})