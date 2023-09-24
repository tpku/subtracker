import React, { useState, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Modal,
  useWindowDimensions,
} from "react-native"

const CustomDropdown = (props) => {
  const { label, data, onSelect, value } = props
  const [visible, setVisible] = useState(false)
  const DropdownButton = useRef()
  const [dropdownTop, setDropdownTop] = useState(0)
  const [selected, setSelected] = useState(undefined)
  const { height, width } = useWindowDimensions()

  const toggleDropdown = () => {
    // setVisible(!visible)
    visible ? setVisible(false) : openDropdown()
  }

  const openDropdown = () => {
    DropdownButton.current.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h)
    })
    setVisible(true)
  }

  const renderItem = ({ item }) => {
    return (
      <Pressable style={styles.item} onPress={() => onItemPress(item)}>
        <Text>{item.label}</Text>
      </Pressable>
    )
  }

  const renderDropDown = () => {
    return (
      <Modal visible={visible} transparent animationType="none">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View
            style={[
              { width: width - 32 },
              styles.dropdown,
              { top: dropdownTop },
            ]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </Pressable>
      </Modal>
    )
  }

  const onItemPress = (item) => {
    setSelected(item)
    onSelect(item)
    setVisible(false)
  }

  return (
    <Pressable
      ref={DropdownButton}
      style={styles.container}
      onPress={toggleDropdown}>
      {renderDropDown()}
      <Text style={styles.buttonText}>
        {(selected && selected.label) || label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 36,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#3693CF",

    flexDirection: "row",
    zIndex: 1,
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
  },
  dropdown: {
    position: "absolute",
    // width: "92%",

    // FIXME: Replace shadow styling
    // shadowColor: "#000000",
    // shadowRadius: 10,
    // shadowOffset: { height: 4, width: 0 },
    // shadowOpacity: 0.5,
    justifyContent: "center",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#3693CF",
    right: 16,
    marginLeft: 32,
  },
  item: {
    backgroundColor: "#ffffff",
    // width: "%",
    paddingHorizontal: 10,
    paddingVertical: 10,
    // borderBottomWidth: 2,
  },
})
export default CustomDropdown
