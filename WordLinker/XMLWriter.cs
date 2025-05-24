using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Xml.Linq;

namespace WordLinkerTool
{
    public class XMLWriter
    {
        public string fileLocation { get; set; }
        private HashSet<string> uniqueWordPairs = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private Dictionary<string, List<LinkedWords>> wordPairsByWord = new Dictionary<string, List<LinkedWords>>(StringComparer.OrdinalIgnoreCase);

        public XMLWriter()
        {
            // Initialize with default location if needed
            LoadExistingWords();
        }

        // Load existing words from both word files to prevent duplicates
        private void LoadExistingWords()
        {
            try
            {
                string[] wordFiles = { 
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "LinkedWords", "ChainReactionWords.txt"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "LinkedWords", "WordsToLink.txt"),
                    Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "..", "LinkedWords", "EnhancedWords.txt")
                };

                foreach (var file in wordFiles)
                {
                    if (File.Exists(file))
                    {
                        ParseWordFile(file);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error loading existing words: {ex.Message}");
            }
        }

        private void ParseWordFile(string filePath)
        {
            string currentWord = null;
            
            foreach (var line in File.ReadLines(filePath))
            {
                string trimmedLine = line.Trim();
                
                if (string.IsNullOrWhiteSpace(trimmedLine))
                    continue;
                
                if (trimmedLine.EndsWith(":"))
                {
                    currentWord = trimmedLine.Substring(0, trimmedLine.Length - 1).ToLower();
                    continue;
                }
                
                if (trimmedLine.StartsWith("-") && trimmedLine.EndsWith(",") && currentWord != null)
                {
                    string secondWord = trimmedLine.Substring(1, trimmedLine.Length - 2).ToLower();
                    RegisterWordPair(currentWord, secondWord);
                }
                else if (trimmedLine.EndsWith("-,"))
                {
                    string firstWord = trimmedLine.Substring(0, trimmedLine.Length - 2).ToLower();
                    RegisterWordPair(firstWord, currentWord);
                }
            }
        }

        private void RegisterWordPair(string firstWord, string secondWord)
        {
            if (string.IsNullOrWhiteSpace(firstWord) || string.IsNullOrWhiteSpace(secondWord))
                return;
                
            // Normalize
            firstWord = firstWord.Trim().ToLower();
            secondWord = secondWord.Trim().ToLower();
            
            // Create unique key
            string key = $"{firstWord}|{secondWord}";
            
            // Add to our tracking sets
            uniqueWordPairs.Add(key);
            
            // Track by word for quick lookups
            if (!wordPairsByWord.ContainsKey(firstWord))
                wordPairsByWord[firstWord] = new List<LinkedWords>();
                
            wordPairsByWord[firstWord].Add(new LinkedWords { FirstWord = firstWord, SecondWord = secondWord });
        }

        public bool AreLinkedWordsUnique(LinkedWords words)
        {
            // Normalize the words to ensure consistent comparison (lowercase, trim)
            string firstWord = words.FirstWord.Trim().ToLower();
            string secondWord = words.SecondWord.Trim().ToLower();
            
            // Create a unique key for this word pair
            string key = $"{firstWord}|{secondWord}";
            
            // Check if this combination already exists in our set
            if (uniqueWordPairs.Contains(key))
            {
                return false;
            }
            
            // Also check in reverse order to prevent "word1 word2" and "word2 word1" duplicates
            string reverseKey = $"{secondWord}|{firstWord}";
            if (uniqueWordPairs.Contains(reverseKey))
            {
                return false;
            }
            
            // Add to our set for future checks
            uniqueWordPairs.Add(key);
            return true;
        }

        public void AddLinkedWordsToXML(LinkedWords words)
        {
            if (string.IsNullOrWhiteSpace(fileLocation))
            {
                // Handle missing file location
                return;
            }

            try
            {
                XDocument doc;
                if (File.Exists(fileLocation))
                {
                    // Load existing document
                    doc = XDocument.Load(fileLocation);
                }
                else
                {
                    // Create new document
                    doc = new XDocument(
                        new XDeclaration("1.0", "utf-8", "yes"),
                        new XElement("WordLinks")
                    );
                }

                // Add new element
                XElement root = doc.Element("WordLinks");
                root.Add(new XElement("WordLink",
                    new XAttribute("FirstWord", words.FirstWord),
                    new XAttribute("SecondWord", words.SecondWord)
                ));

                // Save document
                doc.Save(fileLocation);
            }
            catch (Exception ex)
            {
                // Handle exceptions
                Console.WriteLine($"Error writing to XML: {ex.Message}");
            }
        }
    }
}