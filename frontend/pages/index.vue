<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800">
    <div class="container mx-auto px-4 py-8">
      <header class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">AI Code Documentation Generator</h1>
        <p class="text-xl text-gray-300">Generate accurate documentation for your code instantly</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        <!-- Input Panel -->
        <div class="bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col">
          <div class="mb-4">
            <h2 class="text-2xl font-semibold text-white mb-4">Input Code</h2>

            <!-- Configuration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Programming Language</label>
                <USelect
                  v-model="language"
                  :options="languageOptions"
                  placeholder="Select language"
                  class="w-full"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Documentation Style</label>
                <USelect
                  v-model="style"
                  :options="styleOptions"
                  placeholder="Select style"
                  class="w-full"
                />
              </div>
            </div>

            <!-- File Upload -->
            <div class="mb-4">
              <UButton
                variant="outline"
                color="primary"
                @click="triggerFileUpload"
                class="mb-2"
              >
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 mr-2" />
                Upload Code File
              </UButton>
              <input
                ref="fileInput"
                type="file"
                @change="handleFileUpload"
                class="hidden"
                accept=".js,.py,.java,.cpp,.ts,.php,.go,.rs"
              />
              <p v-if="uploadedFile" class="text-sm text-gray-400 mt-1">
                Uploaded: {{ uploadedFile.name }}
              </p>
            </div>

            <!-- Code Input -->
            <div class="flex-1 relative">
              <textarea
                v-model="code"
                placeholder="Paste your code here..."
                class="w-full h-full p-4 bg-gray-900 text-green-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
                rows="10"
              />
            </div>
          </div>

          <!-- Generate Button -->
          <div class="flex justify-center mt-4">
            <UButton
              :loading="isLoading"
              :disabled="!code || !language || !style || isLoading"
              size="lg"
              color="primary"
              variant="solid"
              @click="generateDocumentation"
              class="px-8 py-3"
            >
              <UIcon name="i-heroicons-magic-wand" class="w-5 h-5 mr-2" />
              Generate Documentation
            </UButton>
          </div>
        </div>

        <!-- Output Panel -->
        <div class="bg-gray-800 rounded-lg shadow-2xl p-6 flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold text-white">Generated Documentation</h2>
            <div class="flex gap-2">
              <UButton
                variant="outline"
                color="primary"
                size="sm"
                @click="copyDocumentation"
                :disabled="!documentation"
              >
                <UIcon name="i-heroicons-document-duplicate" class="w-4 h-4 mr-1" />
                Copy
              </UButton>
              <UButton
                variant="outline"
                color="primary"
                size="sm"
                @click="downloadDocumentation"
                :disabled="!documentation"
              >
                <UIcon name="i-heroicons-download" class="w-4 h-4 mr-1" />
                Download
              </UButton>
            </div>
          </div>

          <!-- Documentation Output -->
          <div class="flex-1 relative">
            <div
              v-if="!documentation"
              class="w-full h-full flex items-center justify-center bg-gray-900 rounded-lg border-2 border-dashed border-gray-700"
            >
              <p class="text-gray-500 text-center">
                <UIcon name="i-heroicons-document-text" class="w-12 h-12 mx-auto mb-2 block opacity-50" />
                <span>Your documentation will appear here</span>
              </p>
            </div>
            <textarea
              v-else
              v-model="documentation"
              class="w-full h-full p-4 bg-gray-900 text-blue-400 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none font-mono text-sm"
              rows="10"
              readonly
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-gray-800 p-6 rounded-lg shadow-xl">
        <div class="flex items-center space-x-3">
          <USpinner size="lg" color="primary" />
          <span class="text-white text-lg">Generating documentation...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// State
const code = ref('')
const documentation = ref('')
const language = ref('')
const style = ref('')
const isLoading = ref(false)
const uploadedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement>()

// Options
const languageOptions = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'Python', value: 'python' },
  { label: 'Java', value: 'java' },
  { label: 'C++', value: 'cpp' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'PHP', value: 'php' },
  { label: 'Golang', value: 'golang' },
  { label: 'Rust', value: 'rust' }
]

const styleOptions = [
  { label: 'JSDoc Style', value: 'jsdoc' },
  { label: 'Inline Comments', value: 'inline' },
  { label: 'Markdown', value: 'markdown' }
]

// File Upload
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (file) {
    uploadedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      code.value = e.target?.result as string
    }
    reader.readAsText(file)
  }
}

// Generate Documentation
const generateDocumentation = async () => {
  if (!code.value || !language.value || !style.value) return

  isLoading.value = true

  try {
    const response = await $fetch('/api/generate-docs', {
      method: 'POST',
      body: {
        code: code.value,
        language: language.value,
        style: style.value
      }
    })

    documentation.value = response.documentation || 'No documentation generated.'
  } catch (error) {
    console.error('Error generating documentation:', error)
    documentation.value = 'Error generating documentation. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Actions
const copyDocumentation = async () => {
  if (!documentation.value) return

  try {
    await navigator.clipboard.writeText(documentation.value)
    // You could add a toast notification here
  } catch (error) {
    console.error('Error copying to clipboard:', error)
  }
}

const downloadDocumentation = () => {
  if (!documentation.value) return

  const blob = new Blob([documentation.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'documentation.md'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
</script>