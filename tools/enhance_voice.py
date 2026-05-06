from voicefixer import VoiceFixer
import sys

input_file = sys.argv[1]
output_file = sys.argv[2]

vf = VoiceFixer()
vf.restore(input=input_file, output=output_file)