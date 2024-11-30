export const stringToPastelColor = (string) => {
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  const saturation = 70
  const lightness = 80
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const calculateStats = (generations: any[]) => {
  const distribution = generations.reduce((acc, img) => {
    acc[img.category] = (acc[img.category] || 0) + 1
    return acc
  }, {})

  const total = generations.length

  const distributionStats = Object.entries(distribution).map(
    ([category, count]) => ({
      category,
      count,
      percentage: (count / total) * 100,
      color: category === 'All' ? '#e5e7eb' : stringToPastelColor(category)
    })
  )

  return { distributionStats, total }
}
