const ship = (length) => {
  const container = [];
  let vertical = false;
  for(let i = 0; i < length; i+=1) {
    container.push(0);
  }
  const isVertical = () => vertical;
  const rotate = () => {
    if(vertical) {
      vertical = false;
    }
    else {
      vertical = true;
    }
  };
  const hit = (position) => {
    container[position] = 1;
  };
  const isSunk = () => {
    for(let i = 0; i < container.length; i+=1) {
      if(container[i] === 0) {
        return false;
      }
    }
    return true;
  };
  return {container, isSunk, isVertical, hit, rotate, length};

};

export default ship;