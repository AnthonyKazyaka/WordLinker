using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WordLinkerTool
{
    public class LinkedWords
    {
        public string FirstWord { get; set; }
        public string SecondWord { get; set; }

        public override string ToString()
        {
            return FirstWord + "\t\t" + SecondWord;
        }

    }
}
