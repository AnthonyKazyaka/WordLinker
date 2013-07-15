using System.Diagnostics;
using System.Windows.Controls;
using System.IO;
using System.Windows;
using System.Windows.Media;
using System.Windows.Forms;

namespace WordLinkerTool
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        const string initialFirstWordText = "First Word";
        const string initialSecondWordText = "Second Word";

        string parsedWord;
        StreamReader reader;
        private readonly XMLWriter xwriter = new XMLWriter();

        const string successfulAdditionMessage = "Success!";
        const string duplicateWordsMessage = "This pair of linked words already exists.";
        readonly SolidColorBrush successBrush = new SolidColorBrush(Colors.Green);
        readonly SolidColorBrush errorBrush = new SolidColorBrush(Colors.Red);

        public MainWindow()
        {
            InitializeComponent();

        }

        private void SubmitWordLinks(object sender, RoutedEventArgs e)
        {
            var words = new LinkedWords()
            {
                FirstWord = FirstWordTextBox.Text,
                SecondWord = SecondWordTextBox.Text
            };

            if (xwriter.AreLinkedWordsUnique(words))
            {
                LinkListBox.Items.Add(words);
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


        private void ReadFromFile(string readFileLocation)
        {
            reader = new StreamReader(readFileLocation);

            while (!reader.EndOfStream)
            {
                var line = reader.ReadLine();
                
                ParseLineToCreateLink(line);
            }
        }

        //Anthony Notes: learn RegEx.
        private void ParseLineToCreateLink(string line)
        {
            var parsedLink = new LinkedWords();
            string trimmedLine = line.Trim();
            
            if (trimmedLine[trimmedLine.Length - 1] == ':')
            {
                parsedWord = trimmedLine.Remove(trimmedLine.Length - 1).ToLower(); //Jusitn Notes: This doesn't do anything?
            }
            else
            {
                if (trimmedLine[0] == '-')
                {
                    parsedLink.FirstWord = parsedWord;
                    parsedLink.SecondWord = trimmedLine.Substring(1, trimmedLine.Length - 2).ToLower();

                    Debug.WriteLine(parsedLink.FirstWord + " + " + parsedLink.SecondWord);
                    if (xwriter.AreLinkedWordsUnique(parsedLink))
                    {
                        LinkListBox.Items.Add(parsedLink);
                    }
                }
                else if (trimmedLine[trimmedLine.Length - 2] == '-')
                {
                    parsedLink.FirstWord = trimmedLine.Substring(0, trimmedLine.Length - 2).ToLower();
                    parsedLink.SecondWord = parsedWord;

                    Debug.WriteLine(parsedLink.FirstWord + " + " + parsedLink.SecondWord);
                    if (xwriter.AreLinkedWordsUnique(parsedLink))
                    {
                        LinkListBox.Items.Add(parsedLink);
                    }
                }
            }
        }

        private void XmlSaveDestButton_OnClick(object sender, RoutedEventArgs e)
        {
            if (e.OriginalSource.Equals(XmlSaveDestButtonFile))
            {
                var dialog = new OpenFileDialog();
                dialog.ShowDialog();

                XmlSaveDestination.Text = dialog.FileName;
            }
            else
            {
                var dialog = new FolderBrowserDialog();
                dialog.ShowDialog();

                XmlSaveDestination.Text = dialog.SelectedPath;
            }
        }

        private void ImportFileLocButton_OnClick(object sender, RoutedEventArgs e)
        {
            var dialog = new OpenFileDialog();
            dialog.ShowDialog();

            ImportFileLocation.Text = dialog.FileName;
        }

        private void RemoveLinkButton_OnClick(object sender, RoutedEventArgs e)
        {
            LinkListBox.Items.Remove(LinkListBox.SelectedItem);
        }

        private void FlushButton_OnClick(object sender, RoutedEventArgs e)
        {
            foreach (var link in LinkListBox.Items)
            {
                xwriter.AddLinkedWordsToXML((LinkedWords)link);
            }

            LinkListBox.Items.Clear();

        }

        private void ReadFromFileButton_Click(object sender, RoutedEventArgs e)
        {
            ReadFromFile(ImportFileLocation.Text);
        }
        
        private void XmlSaveDestination_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            xwriter.fileLocation = XmlSaveDestination.Text;
        }

        #region TextBox Placeholder Methods
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
        #endregion

       
    }
}
