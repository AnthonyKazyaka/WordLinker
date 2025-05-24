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

        public XMLWriter()
        {
            // Initialize with default location if needed
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