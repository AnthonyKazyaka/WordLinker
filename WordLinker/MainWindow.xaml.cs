using System;
using System.Collections.Generic;
using System.Linq;
using System.Xml.Linq;
using System.Text;
using System.IO;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Diagnostics;

namespace WordLinkerTool
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        string initialFirstWordText = "First Word";
        string initialSecondWordText = "Second Word";

        string parsedWord;

        StreamReader reader;
        XDocument wordFile;

        string fileLocation = "C:\\Users\\Anthony\\Documents\\Visual Studio 2012\\Projects\\WordLinker\\LinkedWords\\LinkedWords.xml";
        string readTextFileLocation = "C:\\Users\\Anthony\\Documents\\Chain Reaction\\ChainReactionWords.txt";

        string successfulAdditionMessage = "Success!";
        string duplicateWordsMessage = "This pair of linked words already exists.";
        SolidColorBrush successBrush = new SolidColorBrush(Colors.Green);
        SolidColorBrush errorBrush = new SolidColorBrush(Colors.Red);
        SolidColorBrush placeholderTextBrush = new SolidColorBrush(Color.FromArgb(200, 255, 255, 255));

        public MainWindow()
        {
            InitializeComponent();
            try
            {
                wordFile = XDocument.Load(fileLocation);
            }
            catch
            {
                wordFile = new XDocument();
                wordFile.Add(new XElement("root"));
            }

            ReadFromFile(readTextFileLocation);
        }

        private void SubmitWordLinks(object sender, RoutedEventArgs e)
        {
            LinkedWords words = new LinkedWords()
            {
                FirstWord = FirstWordTextBox.Text,
                SecondWord = SecondWordTextBox.Text
            };
            if (AreLinkedWordsUnique(words))
            {
                AddLinkedWordsToXML(words);
                MessageTextBlock.Text = successfulAdditionMessage;
                MessageTextBlock.Foreground = successBrush;
                ResetTextBoxes();
            }
            else
            {
                MessageTextBlock.Text = duplicateWordsMessage;
                MessageTextBlock.Foreground = errorBrush;
            }
            
        }

        private void ResetTextBoxes()
        {
            FirstWordTextBox.Text = "";
            SecondWordTextBox.Text = "";
        }

        private void AddLinkedWordsToXML(string firstWord, string secondWord)
        {
            XElement link = new XElement("link", new XElement("FirstWord", firstWord), new XElement("SecondWord", secondWord));

            wordFile.Element("root").Add(link);
            wordFile.Save(fileLocation);
        }

        private void AddLinkedWordsToXML(LinkedWords wordPair)
        {
            XElement link = new XElement("link", new XElement("FirstWord", wordPair.FirstWord), new XElement("SecondWord", wordPair.SecondWord));

            wordFile.Element("root").Add(link);
            wordFile.Save(fileLocation);
        }

        private void ReadFromFile(string readFileLocation)
        {
            reader = new StreamReader(readFileLocation);

            while (!reader.EndOfStream)
            {
                string line = ParseLine();
                if (line != null || string.IsNullOrWhiteSpace(line))
                    ParseLineToCreateLink(line);
                else break;
            }
        }

        private string ParseLine()
        {
            return reader.ReadLine();
        }

        //Note to self: learn RegEx.
        private void ParseLineToCreateLink(string line)
        {
            LinkedWords parsedLink = new LinkedWords();
            string trimmedLine = line.Trim();
            if (trimmedLine[trimmedLine.Length - 1] == ':')
            {
                parsedWord = trimmedLine.Remove(trimmedLine.Length - 1).ToLower();
            }
            else
            {
                if (trimmedLine[0] == '-')
                {
                    parsedLink.FirstWord = parsedWord;
                    parsedLink.SecondWord = trimmedLine.Substring(1, trimmedLine.Length - 2).ToLower();
                    Debug.WriteLine(parsedLink.FirstWord + " + " + parsedLink.SecondWord);
                    if (AreLinkedWordsUnique(parsedLink))
                        AddLinkedWordsToXML(parsedLink);
                }
                else if (trimmedLine[trimmedLine.Length - 2] == '-')
                {
                    parsedLink.FirstWord = trimmedLine.Substring(0, trimmedLine.Length-2).ToLower();
                    parsedLink.SecondWord = parsedWord;
                    Debug.WriteLine(parsedLink.FirstWord + " + " + parsedLink.SecondWord);
                    if(AreLinkedWordsUnique(parsedLink))
                        AddLinkedWordsToXML(parsedLink);
                }
            }
        }

        /// <summary>
        /// Returns true if there are no duplicates.
        /// </summary>
        /// <param name="words"></param>
        /// <returns></returns>
        private bool AreLinkedWordsUnique(LinkedWords words)
        {
            var nodes = from elements in wordFile.Elements("root").Elements("link")
                        where elements.Element("FirstWord").Value == words.FirstWord && elements.Element("SecondWord").Value == words.SecondWord
                        select elements;
            if (nodes.Count() == 0)
                return true;
            else return false;
        }

        private void FirstWordTextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (FirstWordTextBox.Text == initialFirstWordText)
                FirstWordTextBox.Text = "";
        }

        private void SecondWordTextBox_GotFocus(object sender, RoutedEventArgs e)
        {
            if (SecondWordTextBox.Text == initialSecondWordText)
                SecondWordTextBox.Text = "";
        }

        private void FirstWordTextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (FirstWordTextBox.Text == "")
            {
                FirstWordTextBox.Text = initialFirstWordText;
                //FirstWordTextBox.Foreground = placeholderTextBrush;
            }
        }

        private void SecondWordTextBox_LostFocus(object sender, RoutedEventArgs e)
        {
            if (SecondWordTextBox.Text == "")
            {
                SecondWordTextBox.Text = initialSecondWordText;
                //SecondWordTextBox.Foreground = placeholderTextBrush;
            }
        }
    }
}
