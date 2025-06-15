import * as React from "react"
import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Node {
  id: string
  label: string
  size: number
  color: string
  x?: number
  y?: number
}

interface Edge {
  source: string
  target: string
  weight: number
}

interface SocialGraphProps extends React.HTMLAttributes<HTMLDivElement> {
  nodes: Node[]
  edges: Edge[]
  width?: number
  height?: number
}

export function SocialGraph({ 
  nodes, 
  edges, 
  width = 400, 
  height = 300, 
  className,
  ...props 
}: SocialGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || nodes.length === 0) return

    const svg = svgRef.current
    svg.innerHTML = "" // Clear previous content

    // Position nodes in a circle for simple layout
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    const positionedNodes = nodes.map((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI
      return {
        ...node,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      }
    })

    // Draw edges
    edges.forEach(edge => {
      const sourceNode = positionedNodes.find(n => n.id === edge.source)
      const targetNode = positionedNodes.find(n => n.id === edge.target)
      
      if (sourceNode && targetNode) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line")
        line.setAttribute("x1", sourceNode.x!.toString())
        line.setAttribute("y1", sourceNode.y!.toString())
        line.setAttribute("x2", targetNode.x!.toString())
        line.setAttribute("y2", targetNode.y!.toString())
        line.setAttribute("stroke", "#64748b")
        line.setAttribute("stroke-width", (edge.weight * 2).toString())
        line.setAttribute("opacity", "0.6")
        svg.appendChild(line)
      }
    })

    // Draw nodes
    positionedNodes.forEach(node => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      circle.setAttribute("cx", node.x!.toString())
      circle.setAttribute("cy", node.y!.toString())
      circle.setAttribute("r", (node.size * 8).toString())
      circle.setAttribute("fill", node.color)
      circle.setAttribute("stroke", "#ffffff")
      circle.setAttribute("stroke-width", "2")
      circle.style.cursor = "pointer"
      
      // Add hover effect
      circle.addEventListener("mouseenter", () => {
        circle.setAttribute("stroke-width", "3")
        circle.setAttribute("r", ((node.size * 8) + 2).toString())
      })
      circle.addEventListener("mouseleave", () => {
        circle.setAttribute("stroke-width", "2")
        circle.setAttribute("r", (node.size * 8).toString())
      })
      
      svg.appendChild(circle)

      // Add labels
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text")
      text.setAttribute("x", node.x!.toString())
      text.setAttribute("y", (node.y! + 25).toString())
      text.setAttribute("text-anchor", "middle")
      text.setAttribute("font-size", "12")
      text.setAttribute("fill", "currentColor")
      text.textContent = node.label
      svg.appendChild(text)
    })
  }, [nodes, edges, width, height])

  return (
    <Card className={cn("", className)} {...props}>
      <CardHeader>
        <CardTitle>Social Network Graph</CardTitle>
        <CardDescription>
          Customer relationships and influence patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <svg
            ref={svgRef}
            width={width}
            height={height}
            className="border border-border rounded-lg"
          />
        </div>
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary"></div>
            <span>Target Customer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-secondary"></div>
            <span>Similar Customers</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}