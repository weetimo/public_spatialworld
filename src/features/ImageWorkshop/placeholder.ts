const userIds = ['2gbvy1ed', '4qffh7ml', 'y497dgwg'];
  const critiques = [
    { user: 'Mrs. Eleanor Tan', critique: 'Thought-provoking redesign!' },
    { user: 'Kumar and Priya', critique: 'Very inspiring green space.' },
    { user: 'Alex Wong', critique: 'Interesting heritage aspect!' },
    { user: 'Maya Chen', critique: 'Great work on sustainability.' },
    { user: 'Ethan Lim', critique: 'Impressive urban resilience.' },
  ]

  const randomString = () => Math.random().toString(36).substring(2, 10);

  for (const userId of userIds) {
    const imageFile = new File(['test'], garden1)
    const imageUrl = uploadImage(imageFile)

    const generatedImage = {
      id: uuidv4(),
      critique: critiques,
      engagementId,
      category: 'what',
      imageUrl,
      originalPrompt: randomString(),
      upscaledPrompt: randomString(),
      voters: userIds,
      userId,
      createdAt: new Date().toISOString(),
    }

    createData(`generations/${engagementId}/${userId}`, generatedImage)
    console.log(`Uploaded image for user ${userId}`)
  }