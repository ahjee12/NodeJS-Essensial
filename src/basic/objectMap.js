/* eslint-disable */
const people = [
  { age: 20, city: 'seoul', pet: ['cat', 'dog'] },
  { age: 40, city: 'busan' },
  { age: 31, city: 'daegu', pet: ['cat', 'dog'] },
  { age: 36, city: 'seoul' },
  { age: 27, city: 'busan', pet: 'cat' },
  { age: 24, city: 'seoul', pet: 'dog' },
]

function solveAModern() {
  const allCities = people.filter(({ age }) => age < 30).map(({ city }) => city)
  const set = new Set(allCities)
  return Array.from(set)
}

//console.log(solveAModern())

function solveB() {
  const result = {}
  for (const person of people) {
    const { city, pet: petsOfPerson } = person
    console.log(petsOfPerson)
    if (petsOfPerson) {
      //result[city]는 맨처음 undefined
      const petsOfCity = result[city] || {}
      console.log(result[city] + 're')
      if (typeof petsOfPerson === 'string') {
        const pet = petsOfPerson
        const origNumPetOfCity = petsOfCity[pet] || 0
        petsOfCity[pet] = origNumPetOfCity + 1
      } else {
        for (const pet of petOrPets) {
          const origNumPetOfCity = petsOfCity[pet] || 0
          petsOfCity[pet] = origNumPetOfCity + 1
        }
      }
      result[city] = petsOfCity
      console.log(result[city] + '///' + petsOfCity)
    }
  }
  return result
}

console.log(solveB())
console.log(`-----------------------------------------`)
/**
 *
 *
 */
function solveBModern() {
  return people
    .map(({ pet: petOrPets, city }) => {
      const pets =
        (typeof petOrPets === 'string' ? [petOrPets] : petOrPets) || []

      return {
        city,
        pets,
      }
      /**
         *[
           [
            ['seoul', 'cat'],
            ['seoul], ''
           ],
           [
    
           ]
         ]
         */
    })
    .flatMap(({ city, pets }) => pets.map((pet) => [city, pet]))
    .reduce((result, [city, pet]) => {
      if (!city || !pet) return result

      return {
        ...result,
        [city]: {
          ...result[city],
          [pet]: (result[city]?.[pet] || 0) + 1,
        },
      }
    }, {})
}

console.log(solveBModern())
