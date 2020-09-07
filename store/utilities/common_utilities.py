import ntpath
import json
from store.models import *

from django.core.exceptions import ValidationError


def path_leaf(path):
    head, tail = ntpath.split(path)

    return tail

def get_file_extension(file_name, extension_symbol='.'):
    if not file_name:
        raise ValidationError('Invalid file name.')

    if not extension_symbol:
        raise ValidationError('Invalid extension symbol.')

    lst = file_name.split(extension_symbol)

    if len(lst):
        return extension_symbol + lst[len(lst) - 1]
    else:
        raise ValidationError('No extension found.')