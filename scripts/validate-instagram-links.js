import fs from "fs"
import path from "path"

// Read the shelters.json file
const sheltersPath = path.join(process.cwd(), "data", "shelters.json")
const shelters = JSON.parse(fs.readFileSync(sheltersPath, "utf8"))

// Validate Instagram URLs
const results = {
  total: shelters.length,
  valid: [],
  invalid: [],
  needsManualCheck: [],
}

shelters.forEach((shelter) => {
  const instagram = shelter.instagram?.trim()

  if (!instagram) {
    results.invalid.push({
      shelter: shelter.shelter,
      reason: "No Instagram link provided",
    })
    return
  }

  // Check if it's a valid Instagram URL format
  const instagramUrlPattern = /^https:\/\/(www\.)?instagram\.com\/[\w.]+\/?$/

  if (!instagramUrlPattern.test(instagram)) {
    results.invalid.push({
      shelter: shelter.shelter,
      url: instagram,
      reason: "Invalid Instagram URL format",
    })
  } else {
    results.needsManualCheck.push({
      shelter: shelter.shelter,
      url: instagram,
      reason: "Format valid - requires manual verification of account activity",
    })
  }
})

// Generate report
console.log("\n=== INSTAGRAM LINK VALIDATION REPORT ===\n")
console.log(`Total Shelters: ${results.total}`)
console.log(`Valid Format: ${results.needsManualCheck.length}`)
console.log(`Invalid: ${results.invalid.length}\n`)

if (results.invalid.length > 0) {
  console.log("INVALID LINKS - These should be removed:")
  results.invalid.forEach((item) => {
    console.log(`  ❌ ${item.shelter}`)
    console.log(`     Reason: ${item.reason}`)
    if (item.url) console.log(`     URL: ${item.url}`)
  })
}

console.log("\nSHELTERS NEEDING MANUAL VERIFICATION:")
console.log("(Please check each link for active/accessible accounts)\n")
results.needsManualCheck.forEach((item) => {
  console.log(`  📍 ${item.shelter}`)
  console.log(`     ${item.url}`)
})

// Export results as JSON for reference
const reportPath = path.join(process.cwd(), "instagram-validation-report.json")
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))
console.log(`\n✅ Report saved to: instagram-validation-report.json`)
