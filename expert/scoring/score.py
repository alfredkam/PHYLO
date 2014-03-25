##
## A quick implementation of the scoring algorithm used in Phylo
##
## Author: Jerome Waldispuhl
##
## Copyright 2012, McGill University, Jerome Waldispuhl.
## All rights reserved. No part of Phylo may be used, shared, distributed, or modified
## without written permission from the copyright holders.
##
## Remark: The ancestor are calculated using the a extended version of the Fitch algorithm.
##         A 5th character '-' representing gaps has been added to the nucleotides. It has
##         the least priority in the nucleotide priority list. Pairwise comparison is done
##         using an affine gap cost model.
##

#/usr/bin/python
import os, sys, copy, re, subprocess

label_re = re.compile(r"""
(?P<name>[a-zA-Z0-9]+):(?P<length>[0-9\.]+)[),]\.*
    """,re.VERBOSE)

length_re = re.compile(r"""
:(?P<length>[0-9\.]+)[),]\.*
    """,re.VERBOSE)

###################################################################

## read MSA

def readfasta(msafile):

    f=open(msafile,'r')
    content=f.readlines()
    f.close()

    seqid=None
    msadic={}
    for i in range(len(content)):
        if content[i].startswith('>'):
            seqid=content[i][1:].strip()
            msadic[seqid]=''
        else:
            seqdata=content[i].strip().upper()
            if seqdata.count('A')+seqdata.count('C')+seqdata.count('G')+seqdata.count('T')+seqdata.count('-') != len(seqdata):
                print 'ERROR: Sequence corrupted'
                print seqid,seqdata
                sys.exit(1)
            msadic[seqid]+=seqdata

    # just a check 
    reflen=0
    for myid,myseq in msadic.iteritems():
        if reflen==0:
            reflen=len(myseq)
        else:
            if len(myseq)!=reflen:
                print 'ERROR: MSA corrupted'
                sys.exit(1)

    return msadic

###################################################################

## read tree

def dicfilter(mydic,mylist):
    outdic={}
    for mykey in mydic.keys():
        if mykey in mylist:
            outdic[mykey]=mydic[mykey]
    return outdic

def dicunion(dic1,dic2):
    outdic=copy.deepcopy(dic1)
    for key2 in dic2.keys():
        if not key2 in outdic:
            outdic[key2]=dic2[key2]
        else:
            print 'ERROR: duplicate entry. cannot merge.'
    return outdic

def addedgelen(lenv,mydic):
    for mykey in mydic.keys():
        mydic[mykey]+=lenv

def subtree(mynode,myspecies,anclen,atroot):
    
    intersection = dicfilter(mynode['intree'],myspecies)
    if mynode['left']!=None:
        leftintersection = dicfilter(mynode['left']['intree'],myspecies)
    else:
        leftintersection =  {}
    if mynode['right']!=None:
        rightintersection = dicfilter(mynode['right']['intree'],myspecies)
    else:
        rightintersection =  {}
    
    if len(intersection)==1:
        lkeys = intersection.keys()
        return "%s:%f" % (lkeys[0],intersection[lkeys[0]])
    elif len(intersection)>1:
        if len(rightintersection)==0:
            return subtree(mynode['left'],myspecies,mynode['length'],atroot)
        elif len(leftintersection)==0:
            return subtree(mynode['right'],myspecies,mynode['length'],atroot)
        else:
            if not atroot:
                return '(%s,%s):%f' % (subtree(mynode['left'],myspecies,0.0,False),subtree(mynode['right'],myspecies,0.0,False),mynode['length']+anclen)
            else:
                return '(%s,%s)' % (subtree(mynode['left'],myspecies,0.0,False),subtree(mynode['right'],myspecies,0.0,False))
    else:   
        return None

def buildspecietree(mynode,myspecies):
    return subtree(mynode,myspecies,0.0,True)


def parsetree(data):
    mytree={'id':'root','intree':{}, 'length':0.0, 'parent':None,'left':None,'right':None}
    mynode=mytree
    i=0
    while i<len(data):
        if data[i]=='(':
            #print 'move down'
            if mynode['left']!=None:
                print 'ERROR 1'
                sys.exit(1)
            mynode['left']={'id':'','intree':{}, 'length':0.0,'parent':mynode,'left':None,'right':None}
            mynode=mynode['left']
            i+=1
            continue
        elif (data[i]==')'):
            #print 'move up'
            mynode=mynode['parent']
            mynode['intree'] = dicunion(mynode['left']['intree'],mynode['right']['intree'])
            i+=1
            continue
        elif (data[i]==','):
            #print 'move to sibling'
            if mynode['parent']['right']!=None:
                print 'ERROR 2',mynode['parent']['right']['id'],mynode['id']
                sys.exit(1)
            mynode['parent']['right']={'id':'','intree':{}, 'length':0.0,'parent':mynode['parent'],'left':None,'right':None}
            mynode=mynode['parent']['right']
            i+=1
            continue
        else:
            cell = label_re.match(data[i:])       
            if cell:
                #print 'insert',cell.group('name')
                if mynode['id']!='':
                    print 'ERROR: id already assigned',mynode['id']
                mynode['id']=cell.group('name')
                mynode['length']=float(cell.group('length'))
                mynode['intree'][cell.group('name')]=float(cell.group('length'))
                i+=len(cell.group('name'))+len(cell.group('length'))+1
                continue
            else:
                cell2 = length_re.match(data[i:])
                if cell2:
                    if mynode['id']!='':
                        print 'ERROR: Not an internal node'
                        sys.exit(1)
                    mynode['length'] = float(cell2.group('length'))
                    addedgelen(float(cell2.group('length')),mynode['intree'])
                    i+=len(cell2.group('length'))+1
                    continue
                else:
                    print 'ERROR 3'
                    sys.exit(1)
    return mytree

def readtree(msafile):

    f=open(msafile,'r')
    content=f.readlines()
    f.close()

    if len(content)>1:
        print 'WARNING: Only first line has been considered.'

    return parsetree(content[0].strip())

###################################################################

## Pairwise sequence alignment score

gapopen = -4.0
gapextend = -1.0

def match(c1,c2):
    if c1==c2:
        return 1.0
    else:
        return -1.0

def alignscore(seq1,seq2,endgaps):
    return evalaln2(seq1,seq2,endgaps)
    #return evalaln(seq1,seq2,False,False)


def evalaln2(seq1,seq2,endgaps):

    if len(seq1)!=len(seq2):
        print "ERROR: sequence lengths do not match"
        sys.exit(1)

    size1=len(seq1)-seq1.count('-')
    size2=len(seq2)-seq2.count('-')
    count1=0
    count2=0
    score=0.
    gapmemo=0
    for i in range(len(seq1)):
        # discard empty sequences
        if seq1[i]!='-' or seq2[i]!='-':
            if seq1[i]!='-' and seq2[i]!='-':
                score += match(seq1[i],seq2[i])
                count1+=1
                count2+=1
                gapmemo=0
            elif seq1[i]!='-' and seq2[i]=='-':
                if endgaps or (count2>0 and count2<size2):
                    if gapmemo==1:
                        score+=gapextend
                    else:
                        score+=gapopen
                        gapmemo=1
                count1+=1
            elif seq1[i]=='-' and seq2[i]!='-':
                if endgaps or (count1>0 and count1<size1):
                    if gapmemo==2:
                        score+=gapextend
                    else:
                        score+=gapopen
                        gapmemo=2
                count2+=1

    return score


def evalaln(seq1,seq2,gap1,gap2):
    
    if len(seq1)==0 and len(seq2)==0:
        return 0.0
    
    if seq1[0]!='-' and seq2[0]!='-':
        return match(seq1[0],seq2[0]) + evalaln(seq1[1:],seq2[1:],False,False)
    elif seq1[0]!='-' and seq2[0]=='-':
        if gap2:
            return gapextend + evalaln(seq1[1:],seq2[1:],False,True)
        else:
            return gapopen + gapextend + evalaln(seq1[1:],seq2[1:],False,True)
    elif seq1[0]=='-' and seq2[0]!='-':
        if gap1:
            return gapextend + evalaln(seq1[1:],seq2[1:],True,False)
        else:
            return gapopen + gapextend + evalaln(seq1[1:],seq2[1:],True,False)
    else:
        return evalaln(seq1[1:],seq2[1:],gap1,gap2)

## Fitch

def makemask(myseq):
    mask=[]
    for i in range(len(myseq)):
        mask.append(set([myseq[i]]))
    return mask

def backward(mytree,seqdata):

    if mytree['left']==None and mytree['right']==None:
        mytree['sequence']=seqdata[mytree['id']]
        mytree['mask'] = makemask(seqdata[mytree['id']])
        return 
    else:
        backward(mytree['left'],seqdata)
        backward(mytree['right'],seqdata)
        mask1=mytree['left']['mask']
        mask2=mytree['right']['mask']
        if len(mask1)!=len(mask2):
            print 'ERROR'
            sys.exit(1)

        mytree['mask']=[]
        for i in range(len(mask1)):
            if mask1[i].isdisjoint(mask2[i]):
                tmp=mask1[i] | mask2[i]
            else:
                tmp=mask1[i] & mask2[i]
            mytree['mask'].append(tmp)
#        print mytree['mask']
        return

def forward(mytree):

    if mytree['left']!=None and mytree['right']!=None:
        if mytree['parent']:
            ancestor=mytree['parent']['sequence']
        else:
            ancestor=''
        myseq=''
        for i in range(len(mytree['mask'])):
            localmask=mytree['mask'][i]
            if ancestor and ancestor[i] in localmask:
                myseq+=ancestor[i]
            else:
                if 'A' in localmask:
                    myseq+='A'
                    continue
                elif 'C' in localmask:
                    myseq+='C'
                    continue
                elif 'G' in localmask:
                    myseq+='G'
                    continue
                elif 'T' in localmask:
                    myseq+='T'
                    continue
                elif '-' in localmask:
                    myseq+='-'
                    continue
                else:
                    print 'ERROR',localmask
                    sys.exit(1)
        mytree['sequence']=myseq
        forward(mytree['left'])
        forward(mytree['right'])

def MSAeval(mytree,endgaps):
    
    if mytree['left']==None and mytree['right']==None:
        return 0.0
    else:
        leftscore = alignscore(mytree['sequence'],mytree['left']['sequence'],endgaps)
        rightscore = alignscore(mytree['sequence'],mytree['right']['sequence'],endgaps)
        if False:
            print 'Ancestor:',mytree['sequence'],', Left: ',mytree['left']['sequence'],'=',leftscore
            print 'Ancestor:',mytree['sequence'],', Right:',mytree['right']['sequence'],'=',rightscore
            print '--'
        return leftscore + MSAeval(mytree['left'],endgaps) + rightscore + MSAeval(mytree['right'],endgaps)

def fitch(mytree,seqdata,endgaps):

    if False:
        print "MSA:"
        for name,seq in seqdata.iteritems():
            print seq,name

    backward(mytree,seqdata)
    forward(mytree)

    return MSAeval(mytree,endgaps)

def ancestorEval(treestring,fastafile):
    softpath = "/home/mcb/blanchem/phylo2/evaluateAlignment"

    tempfile = "temp_" + fastafile.replace(".fasta",".tree")
    f = open(tempfile,'w')
    f.write(treestring + '\n')
    f.close()

    command = "%s %s %s" % (softpath,tempfile,fastafile)
    #pipe = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE).stdout
    pipe = subprocess.Popen([softpath,tempfile,fastafile],stdout=subprocess.PIPE,stderr=subprocess.PIPE)

    myoutput = pipe.communicate()[0]

    if myoutput.startswith(fastafile+':'):
        sliced = myoutput.split(':')
        score = float(sliced[1].strip())
    else:
        print >>sys.stderr,"ERROR: Ancestor ouput corrupted.";
        sys.exit(1)
    os.remove(tempfile)

    return score


###################################################################


if __name__ == '__main__':

    endgaps=False
    
    if len(sys.argv)!=4:
        print "COMMAND: python %s <mode> <tree file> <alignment file>"
        print "SYNTAX (mode): F=exclude extremity gap penalty; f=include extremity gap penalty; x=call external program; a=all."
        sys.exit(1)
    else:   
        MSAdata = readfasta(sys.argv[3]) ## read multiple sequence alignment file in fasta format (.faa or .fasta) 
        phylotree = readtree(sys.argv[2]) ## store phylogenetic tree
        
        mode=sys.argv[1]
        if mode=='F' or mode=='A':
            endgaps=False
        elif mode=='f' or mode=='a':
            endgaps=True
        elif mode!='x':
            print 'option',mode,'is not supported'

        newtree = buildspecietree(phylotree,MSAdata.keys()) ## extract subtree. Not necessary if tree has exactly all species (i.e. #leaves==#sequences)
        if mode=='F' or mode=='f' or mode=='a' or mode=='A':
            MSAtree = parsetree(newtree)
            fitchscore = fitch(MSAtree,MSAdata,endgaps) ## compute alignment score
            print 'Maximum Parsimony Score:',fitchscore
        if mode=='x' or mode=='a' or mode=='A':
            ascore = ancestorEval(newtree,sys.argv[3])
            print 'Ancestor Score:',ascore



