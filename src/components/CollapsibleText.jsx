import { useState } from 'react'

function CollapsibleText({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!text || text.length <= maxLength) {
    return <span>{text}</span>
  }

  const truncatedText = text.slice(0, maxLength).trim()
  const lastSpaceIndex = truncatedText.lastIndexOf(' ')
  const smartTruncated = lastSpaceIndex > maxLength * 0.7 
    ? truncatedText.slice(0, lastSpaceIndex)
    : truncatedText

  return (
    <span className="collapsible-text">
      <span className={`text-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {isExpanded ? text : smartTruncated + '...'}
      </span>
      <button
        className="toggle-text-btn"
        onClick={(e) => {
          e.preventDefault()
          setIsExpanded(!isExpanded)
        }}
        type="button"
      >
        {isExpanded ? 'Show less' : 'Read more'}
      </button>
    </span>
  )
}

export default CollapsibleText