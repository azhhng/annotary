function ColorPicker({ bgColors, setBgColors, fontColor, setFontColor }) {
  return (
    <div className="color-picker">
      <label>
        <input
          type="color"
          value={bgColors.start}
          onChange={(e) => setBgColors(prev => ({ ...prev, start: e.target.value }))}
        />
      </label>
      <label>
        <input
          type="color"
          value={bgColors.end}
          onChange={(e) => setBgColors(prev => ({ ...prev, end: e.target.value }))}
        />
      </label>
      <label>
        <input
          type="color"
          value={fontColor}
          onChange={(e) => setFontColor(e.target.value)}
        />
      </label>
    </div>
  )
}

export default ColorPicker