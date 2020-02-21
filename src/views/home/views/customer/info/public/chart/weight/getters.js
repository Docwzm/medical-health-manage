//BMI
export const bmi = function (obj) {
  const val = obj.bmi
  if(val < 18.5) {
    return "偏瘦"
  }else if(val >= 18.5 && val <= 23.9) {
    return "理想"
  } else if(val >= 24 && val <= 28) {
    return "偏胖"
  } else {
    return "肥胖"
  }
}

export const bmiBtn = function (obj) {
  return this.getLevel(obj)
}


//脂肪率
export const pbf = function (obj) {
  const {sex, age} = this.userInfos,
      pbf = obj.pbf
  if(sex == 0 || age == 0 || pbf == 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(age >= 1 && age <=39) {
        if(pbf >=0 && pbf <=12.9) {
          return "偏低"
        } else if(pbf >= 13 && pbf <= 22.9) {
          return "理想"
        } else if(pbf >=23 && pbf <= 27.9) {
          return "偏高"
        } else {
          return "超高"
        }
      } else {
        if(pbf >=0 && pbf <=12.9) {
          return "偏低"
        } else if(pbf >= 13 && pbf <= 23.9) {
          return "理想"
        } else if(pbf >=24 && pbf <= 28.9) {
          return "偏高"
        } else {
          return "超高"
        }
      }
    } else {
      if(age >= 1 && age <=39) {
        if(pbf >=0 && pbf <=21.9) {
          return "偏低"
        } else if(pbf >= 22 && pbf <= 33.9) {
          return "理想"
        } else if(pbf >=34 && pbf <= 38.9) {
          return "偏高"
        } else {
          return "超高"
        }
      } else {
        if(pbf >=0 && pbf <=22.9) {
          return "偏低"
        } else if(pbf >= 23 && pbf <= 34.9) {
          return "理想"
        } else if(pbf >= 35 && pbf <= 39.9) {
          return "偏高"
        } else {
          return "超高"
        }
      }
    }
  }
}

export const pbfBtn = function (obj) {
  return this.getLevel(obj)
}

//肌肉量
export const muscle = function (obj) {
  const {height, sex} = this.userInfos,
      muscle = obj.muscle
  if(!height && sex == 0 || muscle == 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(height < 160) {
        if(muscle >= 0 && muscle <= 38.4) {
          return "偏低"
        } else if(muscle >= 38.5 && muscle <= 46.5) {
          return "标准"
        } else if(muscle >= 46.6) {
          return "理想"
        }
      } else if(height >= 160 && height <= 170) {
        if(muscle >= 0 && muscle <= 43.9) {
          return "偏低"
        } else if(muscle >= 44 && muscle <= 52.4) {
          return "标准"
        } else if(muscle >= 52.5) {
          return "理想"
        }
      } else {
        if(muscle >= 0 && muscle <= 49.3) {
          return "偏低"
        } else if(muscle >= 49.4 && muscle <= 59.4) {
          return "标准"
        } else if(muscle >= 59.5) {
          return "理想"
        }
      }
    } else {
      if(height < 150) {
        if(muscle >= 0 && muscle <= 29) {
          return "偏低"
        } else if(muscle >= 29.1 && muscle <= 34.7) {
          return "标准"
        } else if(muscle >= 34.8) {
          return "理想"
        }
      } else if(height >= 150 && height <= 160) {
        if(muscle >= 0 && muscle <= 32.8) {
          return "偏低"
        } else if(muscle >= 32.9 && muscle <= 37.5) {
          return "标准"
        } else if(muscle >= 37.6) {
          return "理想"
        }
      } else {
        if(muscle >= 0 && muscle <= 36.4) {
          return "偏低"
        } else if(muscle >= 36.5 && muscle <= 42.5) {
          return "标准"
        } else if(muscle >= 42.6) {
          return "理想"
        }
      }
    }
  }

}

export const muscleBtn = function (obj) {
  return this.getLevel(obj)
}

//基础代谢
export const basalMetabolism = function (obj) {
  const {age, sex} = this.userInfos,
      basalMetabolism = obj.basalMetabolism
  if(sex == 0 || age == 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(age <= 29) {
        if(basalMetabolism <= 1549) {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(age >= 30 && age <= 49) {
        if(basalMetabolism <= 1499) {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(age >= 50 && age <= 69) {
        if(basalMetabolism <= 1349) {
          return "偏低"
        } else {
          return "理想"
        }
      } else {
        if(basalMetabolism <= 1219) {
          return "偏低"
        } else {
          return "理想"
        }
      }
    } else {
      if(age <= 29) {
        if(basalMetabolism <= 1209) {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(age >= 30 && age <= 49) {
        if(basalMetabolism <= 1169) {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(age >=50 && age <= 69) {
        if(basalMetabolism <= 1109) {
          return "偏低"
        } else {
          return "理想"
        }
      } else {
        if(basalMetabolism <= 1009) {
          return "偏低"
        } else {
          return "理想"
        }
      }
    }
  }
}

export const basalMetabolismBtn = function (obj) {
  return this.getLevel(obj)
}

//身体年龄
export const age = function (obj) {
  const pbf = obj.pbf,
      {sex, age} = this.userInfos
  if(!pbf && pbf != 0 || sex == 0) {
    return "--"
  }else {
    if(sex == 1) {
      if(pbf < 14) {
        return age-3
      } else if(pbf >= 14 && pbf <= 18.9) {
        return age-2
      } else if(pbf >= 19 && pbf <= 23.9) {
        return age-1
      } else if(pbf >= 24 && pbf <= 26.9) {
        return age+1
      } else if(pbf >= 27 && pbf <= 29.9) {
        return age+2
      } else if(pbf >= 30 && pbf <= 32.9) {
        return age+3
      } else if(pbf >=33 && pbf <= 35.9) {
        return age+4
      } else {
        return age+5
      }
    } else {
      if(pbf < 24) {
        return age-3
      } else if(pbf >= 24 && pbf <= 27.9) {
        return age-2
      } else if(pbf >= 28 && pbf <= 31.9) {
        return age-1
      } else if(pbf >= 32 && pbf <= 34.9) {
        return age+1
      } else if(pbf >= 35 && pbf <= 37.9) {
        return age+2
      } else if(pbf >= 38 && pbf <= 41.9) {
        return age+3
      } else if(pbf >= 42 && pbf <= 45.9) {
        return age+4
      } else {
        return age+5
      }
    }
  }
}

export const ageValue = function (obj) {
  var age = obj
  if(age == 'btn3') {
    return "年轻"
  } else {
    return "偏大"
  }
}

export const ageBtn = function (obj) {
  var age = obj,
      realAge = this.userInfos.age,
      val = age - realAge
  if(age == '--') {
    return 'btn-none'
  } else {
    if(val <= 0) {
      return 'btn3'
    } else{
      return "btn4"
    }
  }
}

//内脏脂肪等级
export const visceralFat = function (obj) {
  const visceralFat =  obj.visceralFat
  if(!visceralFat) {
    return "--"
  } else {
    if(visceralFat < 1) {
      return "偏低"
    } else if(visceralFat >= 1 && visceralFat < 10) {
      return "理想"
    } else if(visceralFat >= 10 && visceralFat < 15) {
      return "偏高"
    } else {
      return "超高"
    }
  }
}

export const visceralFatBtn = function (obj) {
  return this.getLevel(obj)
}

//水分率
export const water = function (obj) {
  const {water} = obj,
      {sex} = this.userInfos
  if(!water || sex == 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(water < 55) {
        return "偏低"
      } else if(water >= 55 && water <= 64.9) {
        return "标准"
      } else {
        return "理想"
      }
    } else {
      if(water < 45) {
        return "偏低"
      } else if(water >= 45 && water <= 59.9) {
        return "标准"
      } else {
        return "理想"
      }
    }
  }

}

export const waterBtn = function (obj) {
  return this.getLevel(obj)
}

//骨量
export const bone = function (obj) {
  const {bone, weight} = obj,
      {sex} = this.userInfos
  if(!bone || sex == 0 || !weight && weight != 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(weight < 60) {
        if(bone < 2.5) {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(weight >= 60 && weight <= 75) {
        if(bone <= 2.8) {
          return "偏低"
        } else {
          return "理想"
        }
      } else {
        if(bone <= 3.1) {
          return "偏低"
        } else {
          return "理想"
        }
      }
    } else {
      if(weight < 45)  {
        if(bone < 1.8)  {
          return "偏低"
        } else {
          return "理想"
        }
      } else if(weight >= 45 && weight <= 60) {
        if(bone < 2.2) {
          return "偏低"
        } else {
          return "理想"
        }
      } else {
        if(bone < 2.5) {
          return "偏低"
        } else {
          return "理想"
        }
      }
    }
  }
}

export const boneBtn = function (obj) {
  return this.getLevel(obj)
}

//蛋白质
export const protein = function (obj) {
  const {protein} = obj
  if(!protein && protein !=0) {
    return "--"
  } else {
    if(protein < 16) {
      return "偏低"
    } else if(protein >= 16 && protein < 20) {
      return "标准"
    } else {
      return "理想"
    }
  }
}

export const proteinBtn = function (obj) {
  return this.getLevel(obj)
}

//身材
export const bodyType = function (obj , obj2) {
  const pbf = obj,
      muscle = obj2
  if(muscle == "--" || pbf == "") {
    return "--"
  } else {
    if((pbf == '偏高' && muscle == '偏低') || (pbf == '超高' && muscle == '偏低')) {
      return "隐性肥胖型"
    } else if((pbf == '偏高' && muscle == '标准') || (pbf == '超高' && muscle == '标准')) {
      return "偏胖型"
    } else if((pbf == '偏高' && muscle == '理想') || (pbf == '超高' && muscle == '理想')) {
      return "结实偏胖型"
    } else if(pbf == '理想' && muscle == '偏低') {
      return "缺乏运动型"
    } else if(pbf == '理想' && muscle == '标准') {
      return "标准型"
    } else if(pbf == '理想' && muscle == '理想') {
      return "健壮型"
    } else if(pbf == '偏低' && muscle =='偏低') {
      return "精瘦型"
    } else if(pbf == '偏低' && muscle == '标准') {
      return "模特型"
    } else if(pbf == '偏低' && muscle == '理想') {
      return "健美型"
    } else {
      return "--"
    }
  }
}

//身材得分
export const bodyPoint = function (obj) {
  const {pbf, bmi} = obj,
      {sex} = this.userInfos
  if(!pbf && pbf != 0 || !bmi && bmi != 0 || sex == 0) {
    return "--"
  } else {
    if(sex == 1) {
      if(pbf <= 18) {
        if(bmi < 21) {
          return parseInt(90-(pbf-14)*0.5+(bmi-21)*4)
        } else {
          return parseInt(90-(pbf-14)+(bmi-21)*2)
        }
      } else {
        if(bmi <= 23) {
          return parseInt(90-(pbf-18)*2-(23-bmi))
        } else {
          return parseInt(90-(pbf-18)*2-(bmi-23))
        }
      }
    } else {
      if(pbf <= 28) {
        if(bmi < 19) {
          return parseInt(90-(pbf-24)*0.5+(bmi-19)*4)
        } else {
          return parseInt(90-(pbf-24)+(bmi-19)*2)
        }
      } else {
        if(bmi < 21) {
          return parseInt(90-(pbf-28)*2-(21-bmi))
        } else {
          return parseInt(90-(pbf-28)*2-(bmi-21))
        }
      }
    }
  }
}

//进度条
export const pointerLeft = function (obj) {
  var {bmi} = obj,
       width = 120
  if(!bmi && bmi != 0) {
    return 0
  } else {
    if(bmi >= 0 && bmi <= 18.5) {
      return bmi*width/18.5-5
    } else if( bmi > 18.5 && bmi <= 24) {
      return width+(bmi-18.5)*width/5.5-5
    } else if (bmi > 24 && bmi <= 28) {
      return 160+(bmi-24)*width/4-5
    } else if (bmi > 28 && bmi <= 32) {
      return 240+(bmi-28)*width/4-5
    } else {
      return 312
    }
  }
}

//进度颜色
export const pointerColor = function(obj) {
  var {bmi} = obj
  if(!bmi && bmi != 0) {
    return '#00C5FF'
  } else {
    if(bmi >= 0 && bmi <= 18.5) {
      return "#00C5FF"
    } else if(bmi > 18.5 && bmi <= 24) {
      return "#6DE016"
    } else if(bmi > 24 && bmi <= 28) {
      return "#FFA715"
    } else {
      return "#FF7517"
    }
  }
}

export default {
  bmi,
  bmiBtn,
  pbf,
  pbfBtn,
  muscle,
  muscleBtn,
  basalMetabolism,
  basalMetabolismBtn,
  age,
  ageValue,
  ageBtn,
  visceralFat,
  visceralFatBtn,
  water,
  waterBtn,
  bone,
  boneBtn,
  protein,
  proteinBtn,
  bodyType,
  bodyPoint,
  pointerLeft,
  pointerColor,
}