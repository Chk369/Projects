import { useToast } from '@/hooks/use-toast'

interface RecommendationData {
  stock_code: string
  description: string
  score: number
  category?: string
  price?: number
}

export const useExport = () => {
  const { toast } = useToast()

  const exportToCSV = (data: RecommendationData[], filename = 'recommendations') => {
    try {
      const headers = ['Stock Code', 'Description', 'Score', 'Category', 'Price']
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.stock_code,
          `"${item.description.replace(/"/g, '""')}"`,
          Math.round(item.score * 100) + '%',
          item.category || 'N/A',
          item.price ? `$${item.price.toFixed(2)}` : 'N/A'
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `Downloaded ${data.length} recommendations as CSV`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export recommendations"
      })
    }
  }

  const exportToPDF = (data: RecommendationData[], filename = 'recommendations') => {
    try {
      // For now, convert to CSV format for PDF until jsPDF is properly configured
      const headers = ['Stock Code', 'Description', 'Score', 'Category', 'Price']
      const csvContent = [
        headers.join(','),
        ...data.map(item => [
          item.stock_code,
          `"${item.description.replace(/"/g, '""')}"`,
          Math.round(item.score * 100) + '%',
          item.category || 'N/A',
          item.price ? `$${item.price.toFixed(2)}` : 'N/A'
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/plain;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.txt`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export successful",
        description: `Downloaded ${data.length} recommendations as text file`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export recommendations"
      })
    }
  }

  return {
    exportToCSV,
    exportToPDF
  }
}